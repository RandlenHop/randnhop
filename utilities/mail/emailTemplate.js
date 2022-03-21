const SITE_NAME = process.env.SITE_NAME;
const LOGO = process.env.CLIENT_URL + "/logo.png";
const copyRight = "© " + new Date().getFullYear() + " " + SITE_NAME;

module.exports = (details) => {
  return `<!DOCTYPE html>
    <html
      lang="en"
      style="
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
        box-sizing: border-box;
        width: 100%;
        overflow-x: hidden;
      "
    >
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta content="telephone=no" name="format-detection" />
        <title>Verify Email</title>
        <style type="text/css">
          html {
            box-sizing: border-box;
            overflow-x: hidden;
          }
          .m0 {
            margin: 0;
            padding: 0;
            color: #333333;
          }
          .center {
            text-align: center;
          }
          .margin {
            margin-top: 3rem;
            margin-bottom: 3rem;
          }
          .margin-top {
            margin-top: 3rem;
          }
          .margin2 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }
          .bg {
            background-color: rgb(243, 243, 243);
          }
          .header {
            margin-top: 1.5rem;
            padding-bottom: 0;
            font-size: 2.5rem;
            font-weight: bold;
            text-align: center;
          }
          .header-2 {
            font-size: 1.7rem;
            margin: 0;
            text-align: center;
          }
          .paragraph {
            line-height: 21px;
            font-size: 15px;
            padding: 1rem 2rem;
            display: block;
            margin: auto;
          }
          .confirm {
            padding: 0.8rem 1.2rem;
            color: white;
            background-color: #eea47fff;
            font-weight: 600;
            font-size: 1.5rem;
          }
          .confirm:hover {
            background-color: #c02828;
          }
          .paragraph2 {
            font-size: 13px;
          }
          .n-d {
            text-decoration: none;
          }
          .color2 {
            color: #999999;
          }
          .mr {
            padding-right: 2rem;
            border-right: 1px solid #999999;
          }
          .small {
            color: #cccccc;
            font-size: 12px;
          }
          .mt {
            margin-top: 1.5rem;
          }
          .padding {
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
            margin: 0;
          }
        </style>
      </head>
      <body class="m0" style="margin: 0; padding: 0; color: #333333">
        <div class="center" style="text-align: center">
          <div class="bg">
            <img
              src=${LOGO}
              alt=${SITE_NAME}
              height="auto"
              width="200"
              title=${SITE_NAME + " Logo"}
              style="margin-top: 3rem; margin-bottom: 3rem"
              class="margin"
            />
          </div>
          <h1
            class="header"
            style="
              margin-top: 1.5rem;
              padding-bottom: 0;
              font-size: 2.5rem;
              font-weight: bold;
              text-align: center;
            "
          >
            Hello, ${details.username}
          </h1>
          <h3
            class="header-2"
            style="font-size: 1.7rem; margin: 0; text-align: center"
          >
            ${details.todo}
          </h3>
          <p
            class="paragraph"
            style="
              line-height: 21px;
              font-size: 15px;
              padding: 1rem 2rem;
              max-width: 500px;
              text-align: center;
            "
          >
            ${details.mailExplainer}

            ${details.mailPrompt}
          </p>
          <p
            class="paragraph"
            style="
              line-height: 21px;
              font-size: 15px;
              padding: 1rem 2rem;
              margin-bottom: 1rem;
            "
          >
            If you did not initialize this, please disregard this email.
          </p>
          <a
            href=${details.url}
            class="confirm"
            style="
              padding: 0.8rem 1.2rem;
              color: white;
              background-color: blue;
              font-weight: 600;
              font-size: 1.5rem;
              text-decoration: none;
            "
            >${details.buttonText}
          </a>


            <p class="paragraph2" style="font-size: 13px">
              ${copyRight}
            </p>

          </div>
        </div>
      </body>
    </html>
    `;
};
