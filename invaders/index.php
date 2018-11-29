<!DOCTYPE html>
<html>
<head>
	<title><?=rawurldecode($_GET['title'])?></title>
	<meta charset="utf-8"/>
	<link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Lato">
	<link rel="stylesheet" type="text/css" href="style/style.css"/>
	<link rel="stylesheet" type="text/css" href="style/press_start_url.css"/>
	<link rel="shortcut icon" href="images/favicon.ico"/>
	<script src="https://bclearningnetwork.com/lib/jquery/jquery-3.2.1.min.js"></script><!-- CreateJS library hosted on BCLN server -->
	<script src="https://bclearningnetwork.com/lib/createjs/createjs-2015.11.26.min.js"></script>
	<script src="helper.js"></script>
	<script src="lib/ndgmr.Collision.js"></script> <!-- https://github.com/olsn/Collision-Detection-for-EaselJS -->

	<script>

	// ensure keyboard commands are received by focusing the iframe (this will not work if game is embedded on another domain)
	function setFocusIframe() {
		var iframe = parent.document.getElementsByTagName("iframe")[0];
		iframe.contentWindow.focus();
	}

	$(document).ready(function(){
		setFocusIframe();
	});

		var questions = [];
		var numlevels;
		var numquestions;
		var gametitle = "<?=$_GET['title']?>";

		$.getJSON("versions/<?=$_GET['title']?>.json", function(json) {
			numlevels = json['numlevels'];
			numquestions = json['numquestions'];

			for (var i = 0; i <= numlevels; i++) {
				for (var j = 0; j <= numquestions; j++) {
					let options = [];
					for (var k = 0; k < 3; k++) {
						options[k] = json['o_'+i+''+j+''+k];
					}
					options[3] = json['a_'+i+''+j]; // add the answer as an option
					shuffle(options);

					questions.push({question: json['q_'+i+''+j], answer: json['a_'+i+''+j], options: options});
				}
			}
		});

	</script>

	<script type="text/javascript" src="invaders.js"></script>
</head>
<body onload="init();">

	<canvas id="gameCanvas" width="900" height="700" tabindex="1">

	</canvas>

</body>
</html>
