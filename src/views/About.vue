<template>
  <v-card id="firstTime">
    <v-card-title id="title">In Beta</v-card-title>
    <v-card-text>
      The site is currently in beta, be patient with us
    </v-card-text>
  </v-card>

  <v-card id="about">
    <v-card-title id="title">About Deepnarration</v-card-title>
    <v-card-text>
      Welcome to Deepnarration, your cutting-edge companion in the realm of digital content creation. At its core, Deepnarration bridges the creative gap between imagination and visualization through advanced machine learning technologies.
      Video and Image Generation: Through our specialized API, the system takes on the role of a virtual artist, creating images or compiling videos that resonate with your narrative. Whether it’s a single image or a video sequence, the AI is equipped to handle a variety of creative tasks:
    </v-card-text>
    <v-card-text>
      <ul>
        <li><strong>Create Image:</strong> Create an image based an input prompt.</li>
        <li><strong>Retheme Image:</strong> Create an new image based on the input image this will take the theme of the guiding text it will be can be guided by a guiding prompt which will attempt to take the image as a pattern and move towards the prompt.</li>
        <li><strong>Similar Image:</strong> Create an image based on the input image. It can be guided by a guiding prompt which will attempt to take the image as a pattern and move towards the prompt.</li>
        <li><strong>Outpaint Image:</strong> Creates an image that is extended beyond the boarders of the original image. A guiding prompt can be given, and this will help to fill the outside pixels, they will also be based on the input image. This needs multiple passes to get good results sometimes.</li>
        <li><strong>Face Swap:</strong> The face swap feature is a playful yet sophisticated tool that combines a target and a source image to produce a hybrid visual. Accompanied by your prompts, it refines the results to meet your specific creative needs.</li>
        <li><strong>Hologram:</strong> Creates a video based on an image and a prompt, and attempts to move around the subject in the image, creates a depth map for the looking glass, rgbd output</li>
        <li><strong>LogoEmerge:</strong> Creates a video based on the first and second image, first image is mostly there at fist, then transforms into second image in about 16 frames.</li>
        <li><strong>Transparent Gif:</strong> Creates a gif with a background removed, currently only using a few different workflows, will be a toggle for the future</li>
        <li><strong>Parallax:</strong> Creates a video based on three different input images. The outer most is the background on the boarder, the second is the background in the mid area, the third is the focus item, also all backgrounds are mixed</li>
        <!-- <li><strong>Story Generator:</strong> Our story module is an innovative video generator that crafts your story scene by scene. You can inject custom images, select music, and even synchronize the visuals to the beat, allowing for a video that’s not just seen but felt.</li> -->
      </ul>
    </v-card-text>
  </v-card>

  <v-card id="firstTime">
    <v-card-title id="title">First Usage</v-card-title>
    <v-card-text>
      Visit our Discord to get your results.
      <v-btn color="primary" href="https://discord.matissetec.dev/" target="_blank">Join Discord</v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
#about firstTime{
  margin-top: 20px;
  margin-left: 20%;
  margin-right: 20%;
  padding: 10px;
}

#title {
  font-size: 2.75rem;
  margin: 20px 0px 20px 0px;
}

ul {
  padding-left: 20px;
  list-style-type: disc;
}

li {
  margin-bottom: 10px;
}

#firstTime {
  margin-top: 30px; /* Adjust the spacing between cards */
}

</style>
