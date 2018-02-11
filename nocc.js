// HTMLCollection doesn't implement iterator in Edge by default.
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

function attachSubObserver(targetNode) {
	// Options for the observer (which mutations to observe)
	let config = { attributes: true };

	// Callback function to execute when mutations are observed
	let callback = function(mutationsList) {
		if (!targetNode.hasChildNodes()) {
			return;
		}

		let container = targetNode.children[0];

		if (!container.hasChildNodes()) {
			return;		
		}

		for (child of container.children) {
			child.innerHTML = child.innerHTML.replace(/\[.*\]/g, '') 
		}    
	};

	// Create an observer instance linked to the callback function
	let observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);

	console.log("Netflix CC destroyer is waiting on", targetNode, " for closed captions to destroy");
}

let docObserverConfig = {
	childList: true,
	subtree: true
};

// Create observer 
new MutationObserver(function (mutations, me) {
	let subsDivs = document.getElementsByClassName("player-timedtext");

	console.log("Found all these subs divs:", subsDivs);

	if (subsDivs[0]) {
		console.log("Found subs container!");

		attachSubObserver(subsDivs[0]);

		// No longer to need to observe the document.
		me.disconnect();
		return;
	}
}).observe(document, docObserverConfig);
