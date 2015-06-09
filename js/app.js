var newEmail = function (index, subject, read, starred) {
    var readClass = read ? "read" : "unread";
    var starClass = starred ? "fa-star" : "fa-star-o";
    var emailHtml =
        '<div class="row email-row ' + readClass + '">\
    <div class="col-sm-1">\
      <p>\
      <input type="checkbox" name="message[' + index + ']">\
      <i class="star fa ' + starClass + ' fa-lg"></i>\
      </p>\
    </div>\
    <div class="col-sm-11 email-subject">\
      <p><span class="subject">' + subject.substring(0, 49) + '</span></p>\
    </div>\
  </div>'
    return emailHtml;
};

var addEmail = function (index, subject, read, starred, labels) { // adds email at end of the email reader section
    var appended = $(".email-list").append(newEmail(index, subject, read, starred));
    labels.forEach(function (label) {
        insertLabel(appended.find('.email-row:last-child'), label);
        insertLabelMenu($(".add-menu"), label);
        insertLabelMenu($(".remove-menu"), label);
    })
};

var addEmails = function (emailResponse) { // add array of email objects
    emailResponse.forEach(function (el) {
        addEmail(el._id, el.subject, el.read, el.starred, el.labels);
    })
};

// returns an array of the id part (name[id]) of the name on the checkbox of each selected element
var getNames = function(selectedItems) {
    var cb = $(selectedItems).find(':checkbox');
    var result = [];
    for(var i = 0; i < cb.length; i++)
        result[i] = cb.get(i).getAttribute('name').replace(/^message\[(.*)\]$/, "$1");
    return result;
};


var markAsRead = function () {
    // must save initial selection as second line won't match after .unread is removed
    var selectedUnread = $('.email-row.unread.selected');
    if (selectedUnread.length > 0)
        sendEmailChanges({ids: getNames(selectedUnread), read: true}, function () {
            selectedUnread.addClass("read");
            selectedUnread.removeClass("unread");
        });
};

var markAsUnRead = function () {
    // must save initial selection as second line won't match after .unread is added
    var selectedRead = $('.email-row.selected').not(".unread");
    if (selectedRead.length > 0)
        sendEmailChanges({ids: getNames(selectedRead), read: false}, function () {
            selectedRead.addClass("unread");
            selectedRead.removeClass("read");
        });
};

var deleteEmail = function () {
    var rowsToDelete = $('.email-row :checked').closest(".email-row");
    sendEmailDeletes(getNames(rowsToDelete), function() {
        rowsToDelete.remove();
    })
};


var insertLabel = function (emailLine, labelText) {
    var tags = $(emailLine).find('.email-label');
    var labelString = '<span class="email-label">' + labelText + '</span>';
    for (var i = 0; i < tags.length; i++) {
        var tagElement = $(tags[i])
        if (tagElement.text() === labelText)
            return true;
        if ((tagElement.text() > labelText)) {
            tagElement.before(labelString);
            return true;
        }
    }
    // fall through loop - put at end of labels - just before the subject
    $(emailLine).find('.subject').before(labelString);
};

var addLabel = function () {
    var labelText = $(this).text();
    $('.email-row :checked').closest('.email-row').each(function (index, row) {
        var transaction = {ids: getNames(row),
            labels:  [labelText]};

        sendAddLabel(transaction, function () {
            var labels = addLabelToArray(getLabelArrayFromRow(row), labelText);
            clearLabelsFromRow(row);
            insertLabelsInRow(labels, row)
        });
    });
}


var getLabelArrayFromRow = function(row) {
    return $(row).find('.email-label').map(function(index, label) {
        return label.innerText;
    }).get();
};

var clearLabelsFromRow = function(row) {
    $(row).find('.email-label').remove();
};

var insertLabelsInRow = function(labels, row) {
    $(row).find('.subject').before(labels.map(function(label) {
        return '<span class="email-label">' + label + '</span>';
    }).join(' '));
};

var addLabelToArray = function(labels, label) {
    if(labels.indexOf(label) < 0) {
        labels.push(label);
        labels.sort();
    }
    return labels;
};


var removeLabel = function (event) {
    var labelText = $(event.target).text();
    var selectedRows = $('.email-row :checked').closest('.email-row') // filter as much as possible to minimize
        .find('.email-label:contains(' + labelText + ')'); // server requests and subsequent delay
    var transaction = {ids: getNames(selectedRows.closest('.email-row')),
                        labels:  [labelText]};

    sendRemoveLabel(transaction, function () {
        $('.email-row :checked').closest('.email-row').find('.email-label:contains(' + labelText + ')').remove();
        });
    };


var setTopBarState = function () {
    setButtonState();
    setMultiSelectIcon();
};

var selectAllEmails = function () {
    $('.email-row :checkbox').prop("checked", true);
    $('.email-row').addClass("selected");
    setTopBarState();
};

var unSelectAllEmails = function () {
    $('.email-row :checkbox').prop("checked", false);
    $('.email-row').removeClass("selected");
    setTopBarState();
};

var multiSelectIcon = function () { // return correct icon value for multiSelect
    var numSelected = $('.email-row :checked').length;
    if (numSelected === 0)
        return "fa-square-o";
    var numCheckboxes = $('.email-row :checkbox').length;
    if (numCheckboxes === numSelected)
        return "fa-check-square-o";
    return "fa-minus-square-o";
};

var setMultiSelectIcon = function () {
    var msi = $(".multi-select i");
    $(msi).removeClass("fa-minus-square-o");
    $(msi).removeClass("fa-check-square-o");
    $(msi).removeClass("fa-square-o");
    $(msi).addClass(multiSelectIcon());
};

var multiSelectStateChange = function () {
    var icon = $(this).find("i");
    if (icon.hasClass("fa-square-o")) {
        selectAllEmails();
    } else {
        if (icon.hasClass("fa-check-square-o")) {
            unSelectAllEmails();
        } else {
            selectAllEmails();
        }
    }
};

var enableButtons = function () {
    $('.db').prop("disabled", false);
};

var disableButtons = function () {
    $('.db').prop("disabled", true);
};

var setButtonState = function () {
    if ($('.email-row :checked').length === 0) {
        disableButtons();
    } else {
        enableButtons();
    }
};

var selectEmailClick = function (event) {
    sessionStorage.setItem('email-jquery:' + $(this).attr('name'), $(this).prop('checked'));
    $(this).closest(".email-row").toggleClass("selected");
    setTopBarState();
};


// menu is a jquery object containing the menu, val is the string to insert into the menu
var insertLabelMenu = function (menu, val) {
    var menuItems = menu.find('li');
    var menuString = '<li><a class="add-label" role="menuitem" tabindex="-1" href="#">' + val + '</a></li>';
    for (var i = 0; i < menuItems.length; i++) {
        var menuElement = $(menuItems[i])
        if (menuElement.text() === val)
            return true;
        if ((menuElement.text() > val) || menuElement.hasClass('divider')) {
            menuElement.before(menuString);
            return true;
        }
    }
    menu.append(menuString);
};

var addLabelToMenu = function () {
    if ($('.modal-content input').val() != "") {
        insertLabelMenu($(".add-menu"), $(".modal-content input").val());
        insertLabelMenu($(".remove-menu"), $(".modal-content input").val());
        $('.modal-content input').val("");
    }
};

var toggleStar = function () {
    var query = {
        ids: [$(this).prev().get(0).getAttribute('name').replace(/^message\[(.*)\]$/, "$1")],
        starred: $(this).hasClass("fa-star-o") ? true : false
    };
    var selectedStar = $(this);
    sendEmailChanges(query, function () {
        if (selectedStar.hasClass("fa-star-o")) {
            selectedStar.removeClass("fa-star-o");
            selectedStar.addClass("fa-star");
        } else {
            selectedStar.removeClass("fa-star");
            selectedStar.addClass("fa-star-o");
        }
    });
};

var keypressModal = function (event) {
    if (event.which === 13) {
        modalDefault();
    }
};

var modalDefault = function () {
    addLabelToMenu();
    $('.modal-content input').val("");
    $('.modal').modal('hide');
};

var modalFocus = function () {
    $('.modal-content input').focus();
};

var restoreState = function () {
    var chk = false;
    $(':checkbox').each(function (index, el) {
        if (chk = sessionStorage.getItem('email-jquery:' + $(el).attr('name'))) {
            $(el).prop('checked', (chk === "true"));
        }
    });
};

var requestEmail = function () {
    $.ajax(window.location.origin + "/messages")
        .then(function (data) {
            console.log("about to add emails");
            console.log(data);
            addEmails(data);
            restoreState();
            setTopBarState();
        })
        .fail(function () {
            alert("could not connect to server");
        });
};

// send updates to the email database
var sendEmailChanges = function (update, updateDOMFunction) {
    var ajaxOption = {
            url: window.location.origin + "/messages",
            contentType: "application/json",
            method: 'PATCH',
            data: JSON.stringify(update)
        };
    console.log(update);
    console.log(ajaxOption);
        $.ajax(ajaxOption)
        .then(updateDOMFunction)
        .fail(function () {
            alert("could not send update to server");
        })
};

var sendRemoveLabel = function(update, updateDOMFunction) {
    var ajaxOption = {
        url: window.location.origin + "/messages/removeLabel",
        contentType: "application/json",
        method: 'PATCH',
        data: JSON.stringify(update)
    };
    console.log(update);
    console.log(ajaxOption);
    $.ajax(ajaxOption)
        .then(updateDOMFunction)
        .fail(function () {
            alert("could not send update to server");
        })

};

var sendAddLabel = function(update, updateDOMFunction) {
    var ajaxOption = {
        url: window.location.origin + "/messages/addLabel",
        contentType: "application/json",
        method: 'PATCH',
        data: JSON.stringify(update)
    };
    console.log(update);
    console.log(ajaxOption);
    $.ajax(ajaxOption)
        .then(updateDOMFunction)
        .fail(function () {
            alert("could not send update to server");
        })

};

// request additional emails
var requestMoreEmail = function() {
    $.ajax();
};

// send delete requests to the email database
var sendEmailDeletes = function(deleteObject, updateDOMFunction) {
    var ajaxOption = {
        url: window.location.origin + "/messages",
        contentType: "application/json",
        method: 'DELETE',
        data: JSON.stringify(deleteObject)
    };
    console.log("in sendEmailUpdates");
    console.log('deleteObject');
    console.log(deleteObject);
    conlole.log("ajaxOption");
    console.log(ajaxOption);
    $.ajax(ajaxOption)
        .then(updateDOMFunction)
        .fail(function () {
            alert("could not send update to server");
        })
};



$(document).ready(function () {
    requestEmail();
    $('.email-list').on('click', ":checkbox", selectEmailClick);
    $('.subject').click(markAsRead);
    $(".mar").click(markAsRead);
    $(".mau").click(markAsUnRead);
    $(".delete-email").click(deleteEmail);
    $(".multi-select").click(multiSelectStateChange);
    $(".modal-save").click(modalDefault);
    $('.modal-dismiss').click(function () {
        $('.modal-content input').val("");
    });
    $(".email-list").on("click", ".star", toggleStar);
    $(".add-menu").on("click", ".add-label", addLabel);
    $(".remove-menu").on("click", removeLabel);
    $('.modal').keypress(keypressModal);
    $('.modal').on('shown.bs.modal', modalFocus);
});
