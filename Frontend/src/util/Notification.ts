const assetPath = "assets/"

export const playNotificationSound = () => {
	var audio = new Audio(assetPath + 'Maskenkarte-HH-Sound.wav');
	audio.play();
}

