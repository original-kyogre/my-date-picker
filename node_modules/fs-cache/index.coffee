fs = require 'fs'
path = require 'path'
crypto = require 'crypto'
mkdirp = require 'mkdirp'

hash = (o) ->
	crypto.createHash('md5').update(o).digest('hex')

module.exports = (dir) ->
	mkdirp.sync dir
	cacheFile = path.join dir, 'fs-cache.map.json'

	map = try JSON.parse fs.readFileSync(cacheFile, 'utf-8')
	map ?= {}

	unlinkExpired = () ->
		for key, time of map
			if new Date > new Date time
				fs.unlink path.join(dir, key), (err) ->
				delete map[key]
		updateMap no



	updateMap = (unlink = yes) ->
		unlinkExpired() if unlink
		fs.writeFileSync cacheFile, JSON.stringify map

	unlinkExpired()

	setExpire = (id, expire) ->
		map[id] = (new Date).getTime() + expire * 1000
		updateMap()

	exists: (key) ->
		return no unless map[hash key]
		try
			fs.statSync path.join(dir, hash key)
			return yes
		catch e
			@invalidate key
			return no

	invalidate: (key) ->
		id = hash key
		setExpire id, -1
		updateMap()

	put: (key, opts) ->
		id = hash key
		file = path.join dir, id
		setExpire id, opts.expire if opts?.expire
		fs.createWriteStream file

	get: (key, opts) ->
		unlinkExpired()
		id = hash key
		file = path.join dir, id
		setExpire id, opts.expire if opts?.expire
		fs.createReadStream file
