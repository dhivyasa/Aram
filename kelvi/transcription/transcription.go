package transcription

import (
	"context"
	"fmt"
	"io"
	"os"

	speech "cloud.google.com/go/speech/apiv1"
	"cloud.google.com/go/speech/apiv1/speechpb"
)

func SayHello() string {

	text := "Hello, World!"
	fmt.Println(text)
	return text
}

func Recognize(w io.Writer, file string) error {
	fmt.Printf("Recognize called with file %v\n", file)
	ctx := context.Background()

	client, err := speech.NewClient(ctx)
	if err != nil {
		fmt.Print("Error creating NewClient")
		return err
	}
	defer client.Close()

	data, err := os.ReadFile(file)
	if err != nil {
		fmt.Print("Error reading the file", err)
		return err
	}

	fmt.Printf("Read the file %v\n", file)

	// Send the contents of the audio file with the encoding and
	// and sample rate information to be transcripted.
	resp, err := client.Recognize(ctx, &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:        speechpb.RecognitionConfig_LINEAR16,
			SampleRateHertz: 16000,
			LanguageCode:    "en-US",
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: data},
		},
	})

	fmt.Printf("Called the Recognize function\n. Got response %v  \n", resp)

	if err != nil {
		fmt.Println("Error in Recognize function")
		fmt.Print(err)
	}

	// Print the results.
	fmt.Println("Results:")
	for _, result := range resp.Results {
		for _, alt := range result.Alternatives {
			fmt.Printf("\"%v\" (confidence=%3f)\n", alt.Transcript, alt.Confidence)
		}
	}
	return nil
}
