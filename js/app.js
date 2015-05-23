
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

// TODO - add click handlers to star and checkbox

var addEmail = function(index, subject) { // adds email at end of the email reader section
  $(".first-row").append(newEmail(index, subject));
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

// find checked email and run setFunc ov each
// setFunc must take 2 args - index of item and element
var processCheckedEmail = function(setFunc) {
  $('.email-row :checked').closest(".email-row").each(setFunc);
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
  alert("in delete email")
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

var addLabelToEmail= function(labelText, email) {
  email.parent().next().prepend('<span class="email-label">' + labelText + '</span>');
}

var addLabel = function(email, labelText) {
  processCheckedEmail(function(el) {
    addLabelToEmail(labelText, el);
  });
}

var removeLabelFromEmail = function(labelText, email) {
  email.parent().next().find(":contains(labelText)").remove();
}

var removeLabel = function(email, labelText) {
  processCheckedEmail(function(el) {removeLabelFromEmail(labelText, el)});
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
  var msi = $(".multiSelect i");
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
  $(this).closest(".email-row").toggleClass("selected");
  setTopBarState();
}

var insertLabelMenu = function(val) {
  $(".dropdown-menu ul").prepend('<li>' + val + '</li>');
  $(".add-menu .dropdown-menu ul li").click(function() {addLabel(val)});
  $(".remove-menu .dropdown-menu ul li").click(function() {removeLabel(val)});

}

var addLabelToMenu = function() {
  $(".modal-content input").value().insertLabelMenu(val);
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

$(document).ready(function() {
  $(':checkbox').click(selectEmailClick);
  $(".subject").click(markAsRead);
  $(".mar").click(markAsRead);
  $(".mau").click(markAsUnRead);
  $(".delete-email").click(deleteEmail);
  $(".multiSelect").click(multiSelectStateChange);
  $(".modal-save").click(addLabelToMenu);
  $(".star").click(toggleStar);
  setMultiSelectIcon();
});
