
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import {
    FiUpload,
    FiFile,
    FiAlertTriangle,
    FiClipboard,
    FiCheckCircle,
    FiXCircle,
    FiZap,
    FiRefreshCw,
    FiDownload,
} from "react-icons/fi"

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append("file", selectedFile)

      try {
        const response = await axios.post("http://localhost:8080/api/analyze", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        setAnalysis(response.data)
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while analyzing the resume")
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  })

  const resetAnalysis = () => {
    setFile(null)
    setAnalysis(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-primary px-12 [all:unset]">
      <div className="max-w-6xl  px-4 sm:px-6 lg:px-8 py-8">
         
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-glass">
            <FiFile size={40} className="text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">AI Resume Analyzer</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Get instant, AI-powered insights to optimize your resume and land your dream job
          </p>
        </div>

        {!analysis && (
          <div className="glass-effect rounded-3xl p-8 mb-8 shadow-card animate-fade-in">
            <div
              {...getRootProps()}
              className={`relative transition-all duration-300 ease-in-out border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer group ${
                isDragActive
                  ? "border-primary-500 bg-primary-50 scale-[1.02] shadow-card-hover"
                  : "border-gray-300 hover:border-primary-400 hover:bg-gray-50/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                    isDragActive
                      ? "bg-primary-100 scale-110"
                      : "bg-gray-100 group-hover:bg-primary-50 group-hover:scale-105"
                  }`}
                >
                  <FiUpload
                    size={32}
                    className={`transition-colors duration-300 ${
                      isDragActive ? "text-primary-600" : "text-gray-400 group-hover:text-primary-500"
                    }`}
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {isDragActive ? "Drop your resume here!" : "Upload your resume"}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">Drag and drop your PDF file here, or click to browse</p>
                <button className="inline-flex items-center px-8 py-4 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-200">
                  <FiUpload size={20} className="mr-2" />
                  Choose File
                </button>
                <p className="text-sm text-gray-500 mt-4">Only PDF files are supported • Max 10MB</p>
              </div>
            </div>

            {file && (
              <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-xl animate-slide-up ">
                <div className="flex items-center">
                  <FiCheckCircle size={24} className="text-success-500 mr-3" />
                  <div>
                    <p className="text-success-800 font-semibold">File uploaded successfully</p>
                    <p className="text-success-600 text-sm">{file.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

    
        {loading && (
          <div className="glass-effect rounded-3xl p-12 text-center mx-12 mb-8 shadow-card animate-fade-in">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Analyzing Your Resume</h3>
            <p className="text-gray-600 text-lg">Our AI is reviewing your resume for optimization opportunities...</p>
          </div>
        )}

        {error && (
          <div className="glass-effect rounded-3xl p-8 mb-8 shadow-card animate-fade-in">
            <div className="bg-danger-50 border border-danger-200 rounded-xl p-6">
              <div className="flex items-center">
                <FiAlertTriangle size={24} className="text-danger-500 mr-3" />
                <div>
                  <h4 className="text-danger-800 font-semibold">Analysis Failed</h4>
                  <p className="text-danger-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="glass-effect rounded-3xl overflow-hidden shadow-card animate-fade-in" style={{margin:'40px'}}>
 
            <div className="bg-gradient-success p-8 text-white">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
                  <p className="text-green-100 text-lg">Here's your detailed resume breakdown</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold">{analysis.overallScore}</div>
                  <div className="text-green-100">Overall Score</div>
                </div>
              </div>
            </div>

            <div className="p-8">
     
              {analysis.summary && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FiClipboard size={24} className="text-info-500 mr-3" />
                    Executive Summary
                  </h3>
                  <div className="bg-info-50 border-l-4 border-info-400 p-6 rounded-r-xl">
                    <p className="text-gray-700 leading-relaxed text-lg">{analysis.summary}</p>
                  </div>
                </div>
              )}

     
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
   
                <div className="bg-success-50 border border-success-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <FiCheckCircle size={24} className="text-success-500 mr-3" />
                    <h3 className="text-xl font-semibold text-success-800">Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysis.pros?.length > 0 ? (
                      analysis.pros.map((item, index) => (
                        <li key={index} className="flex items-start text-success-700">
                          <span className="text-success-500 mr-3 mt-1 text-lg">•</span>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-success-600 italic text-sm">No strengths identified</li>
                    )}
                  </ul>
                </div>

             
                <div className="bg-danger-50 border border-danger-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <FiXCircle size={24} className="text-danger-500 mr-3" />
                    <h3 className="text-xl font-semibold text-danger-800">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysis.cons?.length > 0 ? (
                      analysis.cons.map((item, index) => (
                        <li key={index} className="flex items-start text-danger-700">
                          <span className="text-danger-500 mr-3 mt-1 text-lg">•</span>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-danger-600 italic text-sm">No issues identified</li>
                    )}
                  </ul>
                </div>

                <div className="bg-info-50 border border-info-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <FiZap size={24} className="text-info-500 mr-3" />
                    <h3 className="text-xl font-semibold text-info-800">Recommendations</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysis.recommendations?.length > 0 ? (
                      analysis.recommendations.map((item, index) => (
                        <li key={index} className="flex items-start text-info-700">
                          <span className="text-info-500 mr-3 mt-1 text-lg">•</span>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-info-600 italic text-sm">No recommendations available</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                
                <button
                  onClick={resetAnalysis}
                  className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <FiRefreshCw size={20} className="mr-2" />
                  Analyze Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeAnalysis
