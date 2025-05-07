package main

import (
	"fmt"
	"os"

	transcribe "dhivyasa.kelvi.com/transcription"
)

func getAudioFilePath() string {
	cwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	return fmt.Sprintf("%s/../audio/summer_day.m4a", cwd)
}

func main() {
	w := os.Stdout
	audioFile := getAudioFilePath()
	transcribe.Recognize(w, audioFile)
	fmt.Printf("w: %v\n", w)

}
