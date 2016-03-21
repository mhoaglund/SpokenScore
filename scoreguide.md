SpokenScore is a spec constructed to take advantage of Twilio and nodejs to use a group of individuals and their phones as an automated choir.

SpokenScores are json files with a few required elements and a few options for composing scores.

1. Meta:
    The Meta object is meant to contain metadata, unsurprisingly.
    Necessary properties are Author, PublishDate, and Description.
    Optional properties are Duration, Accomodations and Notes.
    
2. Options:
    The Options object is used to initialize the Score.
    
    Required Properties: 
    MinPPTs (minimum participants, Default: 0)
    MaxPPTs (maximum participants, Default: 24. Set to 0 for unlimited ppts)
    BranchingType (aleatory decision-making within the composition. Default, Random, Protagonizing, None)
    ProgressionType (how the score moves through its time gradient. Stepped, Open, Random)
    BaseURL (the home domain where your server will live)
    DropPolicy (conditions for forcing dropped calls. Default only for now TBD)
    
    Optional Properties:
    Duration
    BaseStoch (base stochasticity for decisionmaking)
    TestURL
    FallbackURL
    AudioDirectory (path from project root to folder where audio is stored. Defaults to /public/audio)
    
3. ScoreBody
    The ScoreBody object is an array of ScoreStep objects.
    If your ProgressionType is Stepped or Open, the order of these will follow a time gradient from top to bottom.
    
4. AmbientBody
    The AmbientBody object is an array of ScoreStep objects and an AmbientLayer object.
    
5. ScoreStep
    The ScoreStep object represents a piece of content- a directive in the score.
    
    Required: 
    StepType (Voice, Sound, Pause)
    DistributionType (Per, Prop. Refers to how voices will be selected for playing this directive)
    
    Optional:
    Callers (int. How many voices for this directive? If present, will override DistributionType to 'Per')
    Proportion (int. A percent. What percentage of voices for this directive? If present, will override DistributionType to 'Prop' )
    Passages (array of strings. Top-to-bottom time gradient. If present, will override StepType to 'Voice')
    Content (the name, with or without extension, of an audio file in the public Audio folder or the Audio directory noted in the Options object)