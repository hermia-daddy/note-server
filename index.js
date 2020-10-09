const express = require('express')
const cors = require('cors')


let notes = [
    {
        "id": 1,
        "content": "HTML is easy",
        "date": "2019-05-30T17:30:31.098Z",
        "important": true
    },
    {
        "id": 2,
        "content": "Browser can execute only JavaScript",
        "date": "2019-05-30T18:39:34.091Z",
        "important": true
    },
    {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "date": "2019-05-30T19:20:14.298Z",
        "important": true
    },
    {
        "content": "aaa",
        "date": "2020-10-06T04:53:24.429Z",
        "important": true,
        "id": 4
    },
    {
        "content": "bbb",
        "date": "2020-10-06T04:54:30.789Z",
        "important": true,
        "id": 5
    },
    {
        "content": "ddd",
        "date": "2020-10-06T04:54:44.232Z",
        "important": true,
        "id": 6
    },
    {
        "content": "ccc",
        "date": "2020-10-07T13:42:11.337Z",
        "important": true,
        "id": 7
    },
    {
        "content": "eee",
        "date": "2020-10-07T13:56:23.598Z",
        "important": false,
        "id": 8
    }
]


const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())



app.get('/api/notes', (req, res) => {
    
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId+1
}

app.post('/api/notes', (req, res) => {

    const body = req.body
    if(!body.content){
        return res.status(400).json({
            error:'content missing'
        })
    }

    const note = {
        content : body.content,
        important: body.important||false,
        date:new Date(),
        id:generateId()
    }

    notes = notes.concat(note)
    console.log(note)
    res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log('delete id:', id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})
