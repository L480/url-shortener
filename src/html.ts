export const frontendHtml = `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <title>URL Shortener</title>
</head>
<style>
    h1 {
        text-align: center;
        margin-top: 2em;
        margin-bottom: 1em;
    }

    .footer {
        text-align: center;
        margin-top: 2em;
        margin-bottom: 2em;
        width: 100%;
    }
</style>

<body>
    <h1>🔗 URL Shortener</h1>

    <div class="col-9 col-xxl-3 mx-auto">
        <div class="alert alert-primary" role="alert" id="alert" hidden></div>

        <form id="form" onsubmit="shortenUrl()">
            <div class="input-group mb-3">
                <label for="basic-url" class="form-label">URL</label>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="https://example.com" id="url"
                        aria-label="https://example.com" aria-describedby="button-addon2" required>
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2"
                        onclick="copyToClipboard()">Copy</button>
                </div>
            </div>

            <div class="mb-3">
                <label for="basic-url" class="form-label">Custom Alias <i>(optional)</i></label>
                <div class="input-group">
                    <span class="input-group-text" id="current-url"></span>
                    <input type="text" class="form-control" id="alias" aria-describedby="basic-addon3 basic-addon4">
                </div>
                <div id="help-block" class="form-text">Existing aliases will be overwritten.</div>
            </div>

            <button class="btn btn-primary" type="submit" id="button">
                <span class="spinner-border spinner-border-sm" aria-hidden="true" id="button-spinner"
                    hidden="true"></span>
                <span role="status" id="button-text">Shorten</span>
            </button>
        </form>
    </div>

    <div class="footer">
        <a href="https://github.com/L480/url-shortener" target="_blank"><img style="height: 1.5em; width: auto;"
                src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg"></a>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>
<script>
    const currentUrl = 'https://' + window.location.host + '/';
    document.getElementById('current-url').textContent = currentUrl;

    async function copyToClipboard() {
        const url = document.getElementById('url').value;
        await navigator.clipboard.writeText(url);
    }

    async function shortenUrl() {
        event.preventDefault();
        if (document.getElementById('url').value.startsWith(currentUrl)) {
            return;
        }
        document.getElementById('button').disabled = true;
        document.getElementById('button-spinner').hidden = false;
        document.getElementById('button-text').innerHTML = 'Shortening ...';
        let requestBody;
        if (document.getElementById('alias').value) {
            requestBody = {
                url: document.getElementById('url').value,
                alias: document.getElementById('alias').value
            }
        } else {
            requestBody = {
                url: document.getElementById('url').value,
            }
        }
        await fetch(window.location.href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then((response) => response.json())
            .then((data) => {
                document.getElementById('button').disabled = false;
                document.getElementById('button-spinner').hidden = true;
                document.getElementById('button-text').innerHTML = 'Shorten';

                if (data.status == 'success') {
                    const url = 'https://' + window.location.host + '/' + data.alias;
                    document.getElementById('url').value = url;
                    document.getElementById('url').setAttribute('class', 'form-control is-valid');
                    setTimeout(function () { document.getElementById('url').setAttribute('class', 'form-control'); }, 2000);
                } else {
                    document.getElementById('alert').setAttribute('class', 'alert alert-danger');
                    document.getElementById('alert').innerHTML = data.message;
                    document.getElementById('alert').hidden = false;
                }
            }).catch(function (err) {
                document.getElementById('button').disabled = false;
                document.getElementById('button-spinner').hidden = true;
                document.getElementById('button-text').innerHTML = 'Shorten';
                document.getElementById('alert').setAttribute('class', 'alert alert-danger');
                document.getElementById('alert').innerHTML = 'Unknow error. Please try again!';
                document.getElementById('alert').hidden = false;
                console.log(err);
            });
        setTimeout(function () { document.getElementById("alert").hidden = true; }, 5000);
    }
</script>

</html>
`

// Recycled from https://github.com/samharp/redirect-website-template/blob/main/loading.html
export const redirectHtml = `
<!DOCTYPE html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer" />
  <meta http-equiv="Refresh" content="2; url={Replace}">

  <style>
    /* css reset */
    * {
      margin: 0;
      padding: 0;
    }

    body {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      line-height: 1.5;
      font-size: 12px;
      font-family: sans-serif;
    }

    .content-container {
      color: white;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .text-container {
      text-align: center;
      color: black;
    }

    /* loading animation styles */
    .loading-container {
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      /* align-items:center; */
    }

    .loading-spinner {
      border: 5px solid #666666;
      /* accent color */
      border-top-color: currentColor;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      position: relative;
      transform: rotate(0deg);
      animation: loadSpin .85s ease infinite;
    }

    @keyframes loadSpin {
      0% {
        transform: rotate(0deg)
      }

      100% {
        transform: rotate(360deg);
      }
    }

    /* text beneath styles */
    a {
      color: currentColor;
    }
  </style>

</head>

<body>
  <div class="content-container">

    <!-- loading animation -->
    <div class="loading-container">
      <!--  -->
      <!-- <p>loading spinner here</p> -->
      <div class="loading-spinner"></div>
    </div>

    <!-- text below -->
    <div class="text-container">
      <p>You are being redirected ...</p>
      <p>Not working? Click <a href="{Replace}">here</a> to redirect immediately.</p>
    </div>

  </div>
</body>

</html>
`