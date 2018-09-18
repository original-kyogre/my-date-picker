# Streamable filesystem cache

```npm install fs-cache```

### Usage

```coffee
fscache = require 'fs-cache'
request = require 'request'

cache = fscache '/tmp/mrdka'


cachedUrlStream = (url) ->
	return cache.get(url, expire: 5) if cache.exists url
	r = request(url)
	r.pipe cache.put(url, expire: 5)
	r


url = 'http://google.com'
cachedUrlStream(url).pipe process.stdout
```


