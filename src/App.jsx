
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Heart, Calendar, ArrowLeft, ArrowRight, Home, Upload } from 'lucide-react'
import eventsData from './data/events.json'
import './App.css'

function App() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const [mediaUrl, setMediaUrl] = useState(null)
  const [mediaType, setMediaType] = useState(null)

  const currentEvent = eventsData[currentEventIndex]

  useEffect(() => {
    try {
      if (!currentEvent.image) {
        setMediaUrl(null)
        setMediaType(null)
        return
      }
      const filename = currentEvent.image.replace(/^\/+/, '')
      const url = `/${filename}`
      setMediaUrl(url)

      const ext = filename.split('.').pop().toLowerCase()
      setMediaType(['mp4', 'webm', 'ogg'].includes(ext) ? 'video' : 'image')
    } catch (err) {
      console.error('Erro ao montar mídia:', err)
      setMediaUrl(null)
      setMediaType(null)
    }
  }, [currentEvent.image])

  // Debug: confira no console
  useEffect(() => {
    console.log('MEDIA TYPE:', mediaType, 'URL:', mediaUrl)
  }, [mediaType, mediaUrl])

  const nextEvent = () => {
    if (currentEventIndex < eventsData.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentEventIndex(currentEventIndex + 1)
        resetQuiz()
        setIsAnimating(false)
      }, 300)
    }
  }

  const prevEvent = () => {
    if (currentEventIndex > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentEventIndex(currentEventIndex - 1)
        resetQuiz()
        setIsAnimating(false)
      }, 300)
    }
  }

  const goToHome = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentEventIndex(0)
      resetQuiz()
      setIsAnimating(false)
    }, 300)
  }

  const jumpToEvent = (index) => {
    if (index !== currentEventIndex) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentEventIndex(index)
        resetQuiz()
        setIsAnimating(false)
      }, 300)
    }
  }

  const resetQuiz = () => {
    setShowQuiz(false)
    setSelectedAnswer('')
    setShowResult(false)
    setIsCorrect(false)
  }

  const handleQuizAnswer = (answer) => {
    setSelectedAnswer(answer)
    setIsCorrect(answer === currentEvent.quiz.answer)
    setShowResult(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-pink-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Nossa Estória inicial que nunca vai acabar 
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">Vi&Vic</Badge>
              <Button variant="ghost" size="sm" onClick={goToHome} className="hover:bg-pink-100 dark:hover:bg-gray-700">
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Evento {currentEventIndex + 1} de {eventsData.length}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(((currentEventIndex + 1) / eventsData.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out" style={{ width: `${((currentEventIndex + 1) / eventsData.length) * 100}%` }} />
            </div>
          </div>

          {/* Event Card */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <Card className="mb-8 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-pink-500" />
                  <Badge variant="secondary" className="text-lg px-4 py-1 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900">{currentEvent.date}</Badge>
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">{currentEvent.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`relative aspect-video rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg ${mediaType === 'video' ? 'bg-black' : 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-gray-700 dark:to-gray-600'}`}> 
                  {mediaUrl ? (
                    mediaType === 'video' ? (
                      <video
                        controls
                        onLoadedData={() => console.log('Video carregado com sucesso:', mediaUrl)}
                        onError={(e) => console.error('Erro ao carregar vídeo:', e)}
                        className="absolute inset-0 w-full h-full object-cover"
                      >
                        <source src={mediaUrl} type={`video/${mediaUrl.split('.').pop()}`} />
                        Seu navegador não suporta vídeo.
                      </video>
                    ) : (
                      <img src={mediaUrl} alt={currentEvent.title} className="absolute inset-0 w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-6">
                        <Heart className="h-16 w-16 text-pink-400 mx-auto mb-4 transition-transform duration-300" />
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">📸 Adicione sua mídia aqui</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{currentEvent.image}</p>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Upload className="h-3 w-3 mr-1" />Substituir mídia
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <CardDescription className="text-lg text-center leading-relaxed text-gray-700 dark:text-gray-300 p-4 bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg">
                  {currentEvent.description}
                </CardDescription>

                {/* Quiz Section */}
                {currentEvent.quiz && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-pink-200 dark:border-gray-600">
                    {!showQuiz ? (
                      <div className="text-center">
                        <Button onClick={() => setShowQuiz(true)} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">
                          <Heart className="h-4 w-4 mr-2" />Responder Quiz 💕
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">{currentEvent.quiz.question}</h3>
                        {!showResult ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentEvent.quiz.options.map((option, idx) => (
                              <Button key={idx} variant="outline" onClick={() => handleQuizAnswer(option)} className="p-4 text-left hover:bg-pink-100 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-200">{option}</Button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center space-y-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                            <div className={`text-3xl ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>{isCorrect ? '🎉 Correto!' : '💔 Ops, não foi dessa vez!'}</div>
                            <p className="text-gray-700 dark:text-gray-300">Sua resposta: <strong	className="text-pink-600 dark:text-pink-400">{selectedAnswer}</strong></p>
                            <p className="text-gray-700 dark:text-gray-300">Resposta correta: <strong className="text-green-600 dark:text-green-400">{currentEvent.quiz.answer}</strong></p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={prevEvent} disabled={currentEventIndex === 0} className="flex items-center space-x-2 hover:bg-pink-100 dark:hover:bg-gray-700 disabled:opacity-50">
              <ArrowLeft className="h-4 w-4" /><span>Anterior</span>
            </Button>
            <div className="flex space-x-2 max-w-md overflow-x-auto">
              {eventsData.map((_, idx) => (
                <button key={idx} onClick={() => jumpToEvent(idx)} className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentEventIndex ? 'bg-pink-500 scale-125 shadow-lg' : 'bg-gray-300 dark:bg-gray-600 hover:bg-pink-300 hover:scale-110'}`} title={`Evento ${idx+1}: ${eventsData[idx].title}`} />
              ))}
            </div>
            <Button variant="outline" onClick={nextEvent} disabled={currentEventIndex === eventsData.length-1} className="flex items-center space-x-2 hover:bg-pink-100 dark:hover:bg-gray-700 disabled:opacity-50">
              <span>Próximo</span><ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Timeline Preview */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-pink-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">Nossa Linha do Tempo 💕</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {eventsData.map((event, idx) => (
                <button key={idx} onClick={() => jumpToEvent(idx)} className={`p-2 rounded text-xs transition-all duration-200 ${idx === currentEventIndex ? 'bg-pink-500 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-gray-600'}`}>
                  <div className="font-semibold">{event.date}</div><div className="truncate">{event.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-pink-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Feito com muito carinho para o meu amor</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Nossa jornada de amor que ja passa dos 2 anos juntos.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <Badge variant="outline" className="text-xs">{eventsData.length} Momentos</Badge>
            <Badge variant="outline" className="text-xs">{eventsData.length} Quiz Interativo</Badge>
            <Badge variant="outline" className="text-xs">100% Amor</Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

