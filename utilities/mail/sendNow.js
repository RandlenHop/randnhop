module.exports = ({}) => {
  return {
    email,
    username: emailExists.username,
    subject: "Verify Email",
    todo: "Confirm your registed Email",
    mailExplainer:
      "You have received this message because your email address has been registered with our site.",
    mailPrompt:
      "Please click the button below to verify your email address and confirm that you are the owner of this account.",
    url: CLIENT_URL + "/verify/" + token,
    buttonText: "CONFIRM",
  };
};
