require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')


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

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })

})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/notes', (req, res) => {

    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})
