ig.module( 'game.tracks.HeartBeat' )
.requires(
    'game.rhythm.Note',
    'game.rhythm.Rhythm'
)
.defines(function(){
    HeartBeat = {
        songMetadata : {
            file   : "media/Home.mp3",

            name   : "Home",
            artist : "The Hoot Hoots",

            length  : 249,
            formats : [
                ig.Sound.FORMAT.OGG,
                ig.Sound.FORMAT.MP3,
                ig.Sound.FORMAT.M4A
            ]
        },

        rhythm : new Rhythm( 60, 0, [
                new Note(1,0), new Note(2,0), new Note(3,0),  new Note(4,0),  new Note(5,0),  new Note(6,0),  new Note(7,0),
                new Note(8,0), new Note(9,0), new Note(10,0), new Note(11,0), new Note(12,0), new Note(13,0), new Note(14,0)
            ]
        )
    };
})