// Recycled from https://github.com/xyTom/Url-Shorten-Worker/blob/gh-pages/index.html
export const frontendHtml = `
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="content-type" content="txt/html; charset=utf-8" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://gcore.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"
        integrity="sha256-L/W5Wfqfa0sdBNIKN9cG6QA5F2qx4qICmU2VgLruv9Y=" crossorigin="anonymous">
    <title>URL Shortener</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            cursor: default;
        }

        html,
        body {
            height: 100%;
        }

        body {
            display: -webkit-box;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            vertical-align: center;
            flex-wrap: wrap;
            align-content: center;
            color: #2a2b2c;
            background-color: #ebedee;
            overflow: hidden;
        }

        .card {
            background-color: transparent;
            width: 768px;
        }

        .card-text {
            text-align: center;
        }

        .card-text>a {
            text-decoration: none;
            color: #007bff;
        }

        .card-text>a {
            cursor: pointer;
        }

        .form-control {
            cursor: auto;
        }

        @media (max-width: 769px) {
            .card {
                width: 80%;
            }
        }

        @media (max-width: 420px) {
            .card {
                width: 95%;
            }
        }

        @media (prefers-color-scheme: dark) {
            body {
                color: #d9d9d9;
                background: #1b1b1b;
            }

            .card {
                background-color: #252d38;
            }
        }
    </style>
    <script>
        let res
        function shorturl() {
            if (document.querySelector("#text").value == "") {
                alert("URL cannot be empty!")
                return
            }

            document.getElementById("searchbtn").disabled = true;
            document.getElementById("searchbtn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Please wait...';
            fetch(window.location.pathname, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: document.querySelector("#text").value })
            }).then(function (response) {
                return response.json();
            })
                .then(function (myJson) {
                    res = myJson;
                    document.getElementById("searchbtn").disabled = false;
                    document.getElementById("searchbtn").innerHTML = ' Shorten it';
                    if (res.status == "success") {
                        document.getElementById("result").innerHTML = 'https://' + window.location.host + '/' + res.alias;
                    } else {
                        document.getElementById("result").innerHTML = res.message;
                    }
                    $('#exampleModal').modal('show')
                }).catch(function (err) {
                    alert("Unknow error. Please try again!");
                    console.log(err);
                    document.getElementById("searchbtn").disabled = false;
                    document.getElementById("searchbtn").innerHTML = ' Shorten it';
                })
        }
        function copyurl(id, attr) {
            let target = null;

            if (attr) {
                target = document.createElement('div');
                target.id = 'tempTarget';
                target.style.opacity = '0';
                if (id) {
                    let curNode = document.querySelector('#' + id);
                    target.innerText = curNode[attr];
                } else {
                    target.innerText = attr;
                }
                document.body.appendChild(target);
            } else {
                target = document.querySelector('#' + id);
            }

            try {
                let range = document.createRange();
                range.selectNode(target);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
                console.log('Copy success')
            } catch (e) {
                console.log('Copy error')
            }

            if (attr) {
                // remove temp target
                target.parentElement.removeChild(target);
            }
        }
        $(function () {
            $('[data-toggle="popover"]').popover()
        })
    </script>
</head>

<body>
    <div class="card">
        <h5 class="card-header">🔗 Shorten your URLs!</h5>
        <div class="card-body">
            <h5 class="card-title">Please enter the long URL to be shortened:</h5>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Example: https://example.com/" id="text">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="button" onclick='shorturl()' id="searchbtn">Shorten
                        it</button>
                </div>
            </div>
            <div class="card-text">
                Fork me on <a href="https://github.com/L480/url-shortener" target="_blank">GitHub</a><br>
                Frontend made by <a href="https://github.com/xyTom/Url-Shorten-Worker/blob/gh-pages/index.html"
                    target="_blank">xyTom</a>
            </div>
            <p id="notice"></p>
        </div>
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Result</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="result">No result</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick='copyurl("result")' data-toggle="popover"
                        data-placement="bottom" data-content="Copied!">Copy</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <script src="https://gcore.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js"
        integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=" crossorigin="anonymous"></script>
    <script src="https://gcore.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"></script>
    <script src="https://gcore.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js"
        integrity="sha256-WqU1JavFxSAMcLP2WIOI+GB2zWmShMI82mTpLDcqFUg=" crossorigin="anonymous"></script>
</body>

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