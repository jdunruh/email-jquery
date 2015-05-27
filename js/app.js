
var newEmail = function(index, subject) {
  var emailHtml =
    '<div class="row email-row unread">\
      <div class="col-sm-1 email-subject">\
        <p>\
          <input type="checkbox" name="message-' + index + '">\
          <i class="star fa fa-star-o fa-lg"></i>\
        </p>\
      </div>\
    <div class="col-sm-11">\
      <p><span class="subject">' + subject.substring(0, 49) + '<span></p>\
    </div>\
    </div>';
  return emailHtml;
}

// TODO - move click handlers for star and checkbox to outer wrapper and use bubbling

var addEmail = function(index, subject) { // adds email at end of the email reader section
  $(".email-list").append(newEmail(index, subject));
}

var addEmails = function(emailArray) { // add array of email objects
  emailArray.forEach(function(el) {
    addEmail(el.index, el.subject);
  })
}

var setRead = function(index, email) {
  if(email.hasClass("unread")) {
    email.wrapInner("<strong></strong");
    email.removeClass("unread");
  }
}


var markAsRead = function() {
  // must save initial selection as second line won't match aftre .unread is removed
  var selectedUnread = $('.email-row.unread.selected');
  selectedUnread.addClass("read");
  selectedUnread.removeClass("unread");
}

var markAsUnRead = function() {
  // must save initial selection as second line won't match aftre .unread is added
  var selectedRead = $('.email-row.selected').not(".unread");
  selectedRead.addClass("unread");
  selectedRead.removeClass("read");
}

var deleteEmail = function() {
  $('.email-row :checked').closest(".email-row").remove();
}


var setUnRead = function(index, email) {
  if(! email.hasclass("unread")) {
    email.unwrop();
    email.addClass("unread");
  }
}


var toggleStar = function(el) {
  if (el.hasClass("fa-star-o")) {
    el.removeClass("fa-star-o");
    el.addClass("fa-star");
  } else {
    el.removeClass("fa-star");
    el.addClass("fa-star-o");
  }
}

var insertLabel = function(emailLine, labelText) {
  var tags = $(emailLine).find('.email-label');
  var labelString = '<span class="email-label">' + labelText + '</span>';
    for(var i = 0; i < tags.length; i++) {
      var tagElement = $(tags[i])
      if(tagElement.text() === labelText)
        return true;
      if((tagElement.text() > labelText)) {
        tagElement.before(labelString);
        return true;
      }
    }
  $(emailLine).find('.subject').before(labelString);
  }

var addLabel = function() {
  labelText = $(this).text();
  $('.email-row :checked').closest('.email-row').find('.email-subject p').each(function(index, el) {
    return insertLabel(el, labelText);
  });
}

var removeLabel = function(event) {
  var labelText = $(event.target).text();
  $('.email-row :checked').closest('.email-row').find('.email-label:contains(' + labelText + ')').remove();
}

var setTopBarState = function() {
  setButtonState();
  setMultiSelectIcon();
}

var selectAllEmails = function() {
  $('.email-row :checkbox').prop("checked", true);
  $('.email-row').addClass("selected");
  setTopBarState();
}

var unSelectAllEmails = function() {
  $('.email-row :checkbox').prop("checked", false);
  $('.email-row').removeClass("selected");
  setTopBarState();
}

var multiSelectIcon = function() { // return correct icon value for multiSelect
    var numSelected = $('.email-row :checked').length;
    if (numSelected === 0)
      return "fa-square-o";
    var numCheckboxes = $('.email-row :checkbox').length;
    if (numCheckboxes === numSelected)
      return "fa-check-square-o";
    return "fa-minus-square-o";
}

var setMultiSelectIcon = function() {
  var msi = $(".multi-select i");
  $(msi).removeClass("fa-minus-square-o");
  $(msi).removeClass("fa-check-square-o");
  $(msi).removeClass("fa-square-o");
  $(msi).addClass(multiSelectIcon());
}

var multiSelectStateChange = function() {
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
}

var enableButtons = function() {
  $('.db').prop("disabled", false);
}

var disableButtons = function() {
  $('.db').prop("disabled", true);
}

var setButtonState = function() {
  if ($('.email-row :checked').length === 0) {
    disableButtons();
  } else {
    enableButtons();
  }
}

var selectEmailClick = function() {
  sessionStorage.setItem('email-jquery:' + $(this).attr('name'), $(this).prop('checked'));
  $(this).closest(".email-row").toggleClass("selected");
  setTopBarState();
}


// menu is a jquery object containing the menu, val is the string to insert into the menu
var insertLabelMenu = function(menu, val) {
  var menuItems = menu.find('li');
  var menuString = '<li><a class="add-label" role="menuitem" tabindex="-1" href="#">' + val + '</a></li>';
    for(var i = 0; i < menuItems.length; i++) {
      var menuElement = $(menuItems[i])
      if(menuElement.text() === val)
        return true;
      if((menuElement.text() > val) || menuElement.hasClass('divider')) {
        menuElement.before(menuString);
        return true;
      }
    }
  menu.append(menuString);
  }

var addLabelToMenu = function() {
  if($('.modal-content input').val() != "") {
    insertLabelMenu($(".add-menu"), $(".modal-content input").val());
    insertLabelMenu($(".remove-menu"), $(".modal-content input").val());
    $('.modal-content input').val("");
  }
}

var toggleStar = function() {
  if ($(this).hasClass("fa-star-o")) {
    $(this).removeClass("fa-star-o");
    $(this).addClass("fa-star");
  } else {
    $(this).removeClass("fa-star");
    $(this).addClass("fa-star-o");
  }
}

var keypressModal = function(event) {
  if(event.which === 13) {
    modalDefault();
  }
}

var modalDefault = function() {
  addLabelToMenu();
  $('.modal-content input').val("");
  $('.modal').modal('hide');
}

var modalFocus = function() {
  $('.modal-content input').focus();
}

var restoreState = function() {
  var chk = false;
  $(':checkbox').each(function(index, el) {
  if(chk = sessionStorage.getItem('email-jquery:' + $(el).attr('name'))) {
    $(el).prop('checked', (chk === "true"));
  }});
}

$(document).ready(function() {
  $(':checkbox').click(selectEmailClick);
  $('.subject').click(markAsRead);
  $(".mar").click(markAsRead);
  $(".mau").click(markAsUnRead);
  $(".delete-email").click(deleteEmail);
  $(".multi-select").click(multiSelectStateChange);
  $(".modal-save").click(modalDefault);
  $('.modal-dismiss').click(function() { $('.modal-content input').val(""); });
  $(".star").click(toggleStar);
  $(".add-menu").on("click", ".add-label", addLabel);
  $(".remove-menu").on("click", removeLabel);
  $('.modal').keypress(keypressModal);
  $('.modal').on('shown.bs.modal', modalFocus);
  restoreState();
  setMultiSelectIcon();
});
