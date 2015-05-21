
var newEmail = function(index, subject) {
  var emailHtml =
    '<div class="row email-row email-selected first-row">\
      <div class="col-sm-1 email-subject">\
        <p>\
          <input type="checkbox" name="message-' + index + '">\
          <i class="fa fa-star-o fa-lg"></i>\
        </p>\
      </div>\
    <div class="col-sm-11">\
      <p>' + subject.substring(0, 49) + '</p>\
    </div>\
    </div>';
  return emailHtml;
}

var addEmail(index, subject) { // adds email at end of the email reader section
  $(".first-row").append(newEmail(index, subject));
}

var addEmails(emailArray) { // add array of email objects
  emailArray.forEach(function(el) {
    addEmail(el.index, el.subject);
  })
}

var setRead = function(eamil) {
  email.wrapInner("<strong></strong")
}

var unsetRead = function(email) {
  email.unwrop();
}
var removeCheckedEmails() {
  $(".first-row input :checked").parentsUntil(".first-row").remove();
}
var toggleStar = function(el) {
  if el.hasClass("fa-star-o") {
    el.removeClass("fa-star-o");
    el.addClass("fa-star");
  } else {
    el.removeClass("fa-star");
    el.addClass("fa-star-o");
  }
}

var addLabel = function(email labelText) {
  email.find("p").contents().prepend('<span class="email-label">' + labelText + '</span>');
}

var removeLabel = function(email, labelText) {
  email.find('p span :contans(' + labelText + ')').remove();
}
