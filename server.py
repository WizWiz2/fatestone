import http.server
import socketserver
import mimetypes

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        http.server.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")

    def guess_type(self, path):
        mimetype, _ = mimetypes.guess_type(path)
        if mimetype is None:
            return "application/octet-stream"
        # Force UTF-8 for text types
        if mimetype.startswith("text/") or mimetype == "application/javascript":
            return mimetype + "; charset=utf-8"
        return mimetype

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Serving at http://localhost:{PORT} with UTF-8 enforcement")
    httpd.serve_forever()
