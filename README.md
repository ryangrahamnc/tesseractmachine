# Tesseract machine

Docker container for using tesseract to OCR images. Designed for use in kube applications, where you have this running as its own deployment and send cmds to it through POST requests.

## Install and run

`docker run -d -p 1120:1120 ryangrahamnc/tesseractmachine`

## OCR a file

`curl -X POST -F "file=@someimage.jpg" http://localhost:1120/ocrFile`

Output identifies each word and its position:
```json
[
    {
        "level": "5",
        "page_num": "1",
        "block_num": "2",
        "par_num": "3",
        "line_num": "2",
        "word_num": "2",
        "left": "347",
        "top": "211",
        "width": "67",
        "height": "26",
        "conf": "96",
        "text": "needs"
    },
    {
        "level": "5",
        "page_num": "1",
        "block_num": "2",
        "par_num": "3",
        "line_num": "2",
        "word_num": "3",
        "left": "418",
        "top": "214",
        "width": "52",
        "height": "23",
        "conf": "96",
        "text": "to"
    },
    {
        "level": "5",
        "page_num": "1",
        "block_num": "2",
        "par_num": "3",
        "line_num": "2",
        "word_num": "4",
        "left": "481",
        "top": "211",
        "width": "70",
        "height": "32",
        "conf": "95",
        "text": "bring"
    }
]
```

## Check that server is working

<http://localhost:1120/>

If loads, server is running

## Get last output

<http://localhost:1120/last>

For use if you just did a curl command and you want to open the output in your browser for easier visualization
