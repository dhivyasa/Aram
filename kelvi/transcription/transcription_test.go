package transcription

import "testing"

func TestTranscribe(t *testing.T) {
	t.Log("TestTranscribe")
	want := "Hello, World!"
	got := SayHello()
	if got != want {
		t.Errorf("got %s, want %s", got, want)
	}

}
