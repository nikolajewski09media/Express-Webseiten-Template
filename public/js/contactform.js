const contactForm = document.querySelector(".contact-form");
const site_key = document.getElementById("site_key").innerHTML;

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("btn-contact-form").classList.add("loading");

  grecaptcha
    .execute(`${site_key}`, { action: "homepage" })
    .then(function (token) {
      // This data is not being used in the back end (Only the token), but have it here for you to experiment
      let name = document.getElementById("us_form_1_text_1").value;
      let email = document.getElementById("us_form_1_email_1").value;
      let phone = document.getElementById("us_form_1_text_2").value;
      let text = document.getElementById("us_form_1_textarea_1").value;
      const captcha = token;

      fetch("/contact-form", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          text: text,
          captcha: captcha,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          let email_succ = document.getElementById("email_success");
          email_succ.classList.remove("hidden");
          document.getElementById("us_form_1_text_1").value = "";
          document.getElementById("us_form_1_email_1").value = "";
          document.getElementById("us_form_1_text_2").value = "";
          document.getElementById("us_form_1_textarea_1").value = "";
          document
            .getElementById("btn-contact-form")
            .classList.remove("loading");
        });
    });
});
