package main

import (
	"fmt"
	"os"

	transcribe "dhivyasa.kelvi.com/transcription"
)

func main() {
	w := os.Stdout
	transcribe.Recognize(w, "../audio/summer_day.m4a")
	fmt.Printf("w: %v\n", w)

}
