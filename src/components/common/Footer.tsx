/**
 * Footer Component
 */

import React from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <p className="text-sm">
              Financial Calculator helps you plan your MF and NPS investments with precision
              and ease.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Disclaimer</h3>
            <p className="text-sm">
              This calculator is for informational purposes only. Please consult a financial
              advisor before making investment decisions.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Privacy</h3>
            <p className="text-sm">
              We do not collect any personal information. All calculations are performed locally
              in your browser.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {currentYear} Financial Calculator. All rights reserved.</p>
          <p className="text-sm">Made with ❤️ by EPAM</p>
        </div>
      </div>
    </footer>
  )
}
