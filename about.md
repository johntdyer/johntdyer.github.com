---
layout: page
title: About
permalink: /about/
customjs:
  - ../assets/resources/pdf/pdf.js

---

<script>
 //
  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  //
  var url = '../assets/resume.pdf';

   PDFJS.workerSrc = '../assets/resources/pdf/pdf.worker.js';

  //
  // Asynchronous download PDF
  //
  PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
    //
    // Fetch the first page
    //
    pdf.getPage(1).then(function getPageHelloWorld(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);

      //
      // Prepare canvas using PDF page dimensions
      //
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      //
      // Render PDF page into canvas context
      //
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  });
</script>

<canvas id="the-canvas" style="border:1px  solid black"></canvas>

<pre id="code"></pre>
<script>
  document.getElementById('code').textContent = document.getElementById('script').text;
</script>
