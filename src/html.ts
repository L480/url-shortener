export const frontendHtml = `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <title>URL Shortener</title>
</head>

<body>
    <div class="my-5 mx-2">
        <h1 class="display-5 text-center mb-3">🔗 URL Shortener</h1>

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

        <div class="d-flex justify-content-center mt-4">
            <a href="https://github.com/L480/url-shortener" target="_blank"><img style="height: 1.5em; width: auto;"
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg"></a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>
<script>
    const currentUrl = 'https://' + window.location.host + '/';
    document.getElementById('current-url').textContent = currentUrl;

    window.addEventListener('DOMContentLoaded', (event) => {
        const urlField = document.getElementById('url');

        urlField.addEventListener('click', () => {
            document.getElementById('url').setAttribute('class', 'form-control');
            urlField.select();
        });
    });

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

export const redirectHtml = `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="referrer" content="no-referrer" />
    <meta http-equiv="Refresh" content="2; url={Replace}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="my-5 mx-2">
        <h1 class="display-5 text-center">You are being redirected ...</h1>

        <div class="d-flex justify-content-center p-5">
            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div class="d-flex justify-content-center">
            <p class="text-center">Not working? Click <a href="{Replace}">here</a> to redirect immediately.</p>
            </p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>

</html>
`

export const notFoundHtml = `
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="my-5 mx-2">
        <h1 class="display-5 text-center">Nothing to see here!</h1>

        <div class="d-flex justify-content-center p-4">
            <p class="text-center">This domain is being used for URL shortening. However, this route does not exist.</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>

</html>
`