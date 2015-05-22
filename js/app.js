
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

var processCheckedEmail = function(setFunc) {
  $('.email-row input [type="checkbox"]').attr("checked").foreach(setFunc(el));
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

var selectAllEmails = function() {
  $('.email-row input [type="checkbox"]').forEach(function(element) {
    element.attr("checked", true);
  });
}

var unSelectAllEmails = function() {
  $('.email-row input [type="checkbox"]').forEach(function(element) {
    element.removeAttr("checked");
  });
}

var multiSelectStateChange = function() {
  if ($(this).hasClass("fa-square-o")) {
    $(this).removeClass("fa-square-o");
    $(this).addClass("fa-check-square-o");
    selectAllEmails();
  } else {
    if ($(this).hasClass("fa-checked-o")) {
      $(this).removeClass("fa-check-squore-o");
      $(this).addClass("fa-square-o");
      unSelectAllEmails();
    } else {
      $(this).removeClass("fa-minus-square-o");
      $(this).addClass("fa-check-square-o");
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
  if ($('.email-row input [type="checkbox"]').attr("checked").length === 0) {
    disableButtons();
  } else {
    enableButtons();
  }
  $(this).parentsUnitl(".email-row").parent().toggleClass(".selected");
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
  alert("the document is ready");
  $("checkbox").click(selectEmailClick);
  $(".subject").click(setRead());
  $(".mar").click(markAsRead());
  $(".mar").click(markAsUnRead());
  $(".deleteEmail").click(deleteEmail());
  $(".multiSelect").click(multiSelectStateChange());
  $(".modal-save").click(addLabelToMenu());
});
