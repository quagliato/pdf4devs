# pdf4devs

## What is it?

You need a PDF from an URL? That's it! You tell us the URL and we give ou the
PDF.

## How to use?

Make an request to *http://pdf4devs.com/pdf* sending a **JSON** with the 
**url** and the **pageSize** (A3, A4, A5 etc.) that you we'll create the PDF
and return it to you.

## Requirements
- The URL must be public and without any kind of authentication;
- pageSize must me one of this: http://doc.qt.io/qt-4.8/qprinter.html#PaperSize-enum ;
- We will return the whole PDF, not a URL, not a path, the full PDF file;
- A URL will be processed just once in the hour, so if you request the same URL
at 2015-12-08 07:05:00 and at 2015-12-08 07:30:00, we won't process the second
atempt and return the first file;

## Errors
If the process result in an error, we'll return it too. Validation errors too.
These are the possible responses:

`{"status":"ERROR","code":"0001","description":"URL is not valid."}`

`{"status":"ERROR","code":"0002","description":"Page size not accepted."}`

`{"status":"ERROR","code":"0003","description":"Could not create a PDF from the url http://google.com.br"}`

## Status
If you're seeing this, everything is OK. But you can make a GET request to
http://pdf4devs.com/status and we'll return a JSON like this
`{"status":"OK"}` OR like this `{"status":"ERROR"}`.

## Example

```
$ curl -XPOST -H'Content-type:application/json' http://pdf4devs.com/pdf -d'{"url":"http://google.com", "pageSize":"A4"}' > google.pdf
```

## Get in touch
E-mail me at [eduardo@quagliato.me](mailto:eduardo@quagliato.me)
