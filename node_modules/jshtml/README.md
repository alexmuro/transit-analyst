# JsHtml

Master: [![Build Status](https://travis-ci.org/elmerbulthuis/jshtml.png?branch=master)](https://travis-ci.org/elmerbulthuis/jshtml)
Develop: [![Build Status](https://travis-ci.org/elmerbulthuis/jshtml.png?branch=develop)](https://travis-ci.org/elmerbulthuis/jshtml)

JavaScript razor view engine. The razor syntax (also used in asp.net mvc)
keeps your html clean and allows you to use javascript in your templates.

Check out the examples for more information.

If you want to run the tests, be sure to install the devDependencies first by using
	
	npm install
	

## Installation
	
	npm install jshtml


## Example

	<html>
	<head>
		<title>@locals.title</title>
	</head>
	
	<body>
	
	<ul class="Task">
	@for(var taskIndex = 0, taskCount = locals.taskList.length; taskIndex < taskCount; taskIndex ++){
		var task = locals.taskList[taskIndex];
		<li class="@(taskIndex % 2 ? "Odd" : "Even")">
		<a href="/task/@task.id">@task.name</a>
		</li>
	}
	</ul>
	
	<p>
	if you like it, let me know!<br />
	- <a href="mailto:elmerbulthuis@gmail.com">elmerbulthuis@gmail.com</a><br />
	</p>
	
	</body>
	</html>

Also check out the examples in the examples folder!


## Express

use jshtml-express to use it with express 3!

check out https://github.com/elmerbulthuis/jshtml-express for more info.


## License 

Copyright (c) 2011-2013 Elmer Bulthuis <elmerbulthuis@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
