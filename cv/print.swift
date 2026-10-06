// Prints an HTML file to an A4 PDF through WebKit, using the page's print CSS.
// Usage: swift cv/print.swift cv/cv.html public/cv.pdf (or just `yarn cv`).
//
// WebKit because it ships with macOS: headless Chromium is not installed, and
// the browser that is would not print headless. A PDF printed from HTML also
// writes its text in the order the HTML does, which is what a parser reads.
import AppKit
import WebKit

let args = CommandLine.arguments
// Absolute, or AppKit warns that a relative file URL has no scheme.
let input = URL(fileURLWithPath: args[1]).absoluteURL
let output = URL(fileURLWithPath: args[2]).absoluteURL

final class Printer: NSObject, WKNavigationDelegate {
    let window = NSWindow(
        contentRect: NSRect(x: 0, y: 0, width: 794, height: 1123),
        styleMask: [.borderless], backing: .buffered, defer: false)
    let webView = WKWebView(frame: NSRect(x: 0, y: 0, width: 794, height: 1123))

    func start() {
        window.contentView = webView
        webView.navigationDelegate = self
        webView.loadFileURL(input, allowingReadAccessTo: input.deletingLastPathComponent())
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Give the local font a moment to apply before printing.
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { self.print() }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        FileHandle.standardError.write("load failed: \(error)\n".data(using: .utf8)!)
        exit(1)
    }

    func print() {
        let info = NSPrintInfo()
        info.paperSize = NSSize(width: 595.28, height: 841.89)
        info.topMargin = 0
        info.bottomMargin = 0
        info.leftMargin = 0
        info.rightMargin = 0
        info.horizontalPagination = .automatic
        info.verticalPagination = .automatic
        info.jobDisposition = .save
        info.dictionary()[NSPrintInfo.AttributeKey.jobSavingURL] = output
        let operation = webView.printOperation(with: info)
        operation.showsPrintPanel = false
        operation.showsProgressPanel = false
        operation.view?.frame = webView.bounds
        operation.runModal(
            for: window, delegate: self,
            didRun: #selector(printed(_:success:contextInfo:)), contextInfo: nil)
    }

    @objc func printed(_ operation: NSPrintOperation, success: Bool, contextInfo: UnsafeMutableRawPointer?) {
        exit(success ? 0 : 1)
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let printer = Printer()
printer.start()
DispatchQueue.main.asyncAfter(deadline: .now() + 30) {
    FileHandle.standardError.write("timed out\n".data(using: .utf8)!)
    exit(2)
}
app.run()
