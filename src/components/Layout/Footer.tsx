const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600">
          <p className="text-sm mb-1">
            © {new Date().getFullYear()} syurose99
          </p>
          <div className="text-sm space-x-4">
            <span>긴급연락처:</span>
            <span>경찰 112</span>
            <span>응급의료 119</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
