{
  "functions": {
    "api/generateContent.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/generateContent",
      "destination": "/api/generateContent.js"
    }
  ]
}
