
var newEmail = function(index, subject) {
  var emailHtml =
    '<div class="row email-row unread">\
      <div class="col-sm-1 email-subject">\
        <p>\
          <input type="checkbox" name="message-' + index + '">\
          <i class="fa fa-star-o fa-lg"></i>\
        </p>\
      </div>\
    <div class="col-sm-11">\
      <p><span class="subject">' + subject.substring(0, 49) + '<span></p>\
    </div>\
    </div>';
  return emailHtml;
}


var addEmail = function(index, subject) { // adds email at end of the email reader section
  $(".first-row").append(newEmail(index, subject));
}

var addEmails = function(emailArray) { // add array of email objects
  emailArray.forEach(function(el) {
    addEmail(el.index, el.subject);
  })
}

var setRead = function(email) {
  email.wrapInner("<strong></strong");
  email.removeClass("unread");
}

var processCheckedEmail = function(setFunc) { // find checked email and run setFunc ov each
  $('.email-row input [type="checkbox"]').attr("checked").each(setFunc);
}

var markAsRead = function() {
  processCheckedEmail(setRead());
}

var markAsUnRead = function() {
  processCheckedEmail(setUnRead());
}

var deleteEmail = function(el) {
  $('.email-row input [type="checkbox"]').attr("checked").parentsUntil(".email-row").parent().remove();
}


var setUnRead = function(email) {
  email.unwrop();
  email.addClass("unread");
}

var removeCheckedEmails = function() {
  $(".first-row input :checked").parentsUntil(".first-row").remove();
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

var selectEmail = function(email) {
  email.addClass("selected");
  email.find(":checkbox").addAttr("checked", true);
}

var selectAllEmails = function() {
  $('.email-row :checkbox').attr("checked", true);
  $('.email-row').addClass("selected");
}

var unSelectAllEmails = function() {
  $('.email-row :checkbox').removeAttr("checked");
  $('.email-row').removeClass("selected");
}

var multiSelectStateChange = function() {
  alert("in multiselect state change")
  var icon = $(this).find("i");
  if (icon.hasClass("fa-square-o")) {
    icon.removeClass("fa-square-o");
    icon.addClass("fa-check-square-o");
    selectAllEmails();
  } else {
    if (icon.hasClass("fa-check-square-o")) {
      icon.removeClass("fa-check-square-o");
      icon.addClass("fa-square-o");
      unSelectAllEmails();
    } else {
      icon.removeClass("fa-minus-square-o");
      icon.addClass("fa-check-square-o");
      selectAllEmails();
    }
  }
}

var enableButtons = function() {
  $('.db').removeAttr("disabled");
}

var disableButtons = function() {
  $('.db').attr("disabled", true);
}

var selectEmailClick = function() {
  if ($('.email-row :checked').length === 0) {
    disableButtons();
  } else {
    enableButtons();
  }
  $(this).closest(".email-row").toggleClass("selected");
}

var insertLabelMenu = function(val) {
  $(".dropdown-menu ul").prepend('<li>' + val + '</li>');
  $(".add-menu .dropdown-menu ul li").click(function() {addLabel(val)});
  $(".remove-menu .dropdown-menu ul li").click(function() {removeLabel(val)});

}

var addLabelToMenu = function() {
  $(".modal-content input").value().insertLabelMenu(val);
}

$(document).ready(function() {
  $(':checkbox').click(selectEmailClick);
  $(".subject").click(markAsRead);
  $(".mar").click(markAsRead);
  $(".mar").click(markAsUnRead);
  $(".deleteEmail").click(deleteEmail);
  $(".multiSelect").click(multiSelectStateChange);
  $(".modal-save").click(addLabelToMenu);
});
