export function buildCommand(workflow, data) {
  let cmd = 'yt-dlp';
  
  // Input - must be URL or batch file
  if (workflow === 'batch') {
    if (!data.batchFile) return '# Enter a batch file path';
    cmd += ` -a "${data.batchFile}"`;
  } else {
    if (!data.url) return '# Enter a URL';
    cmd += ` "${data.url}"`;
  }
  
  // General Options
  if (data.update) cmd += ' --update';
  if (data.ignoreErrors && !data.abortOnError) cmd += ' --ignore-errors';
  if (data.abortOnError) cmd += ' --abort-on-error';
  if (data.listExtractors) cmd += ' --list-extractors';
  if (data.flatPlaylist) cmd += ' --flat-playlist';
  if (data.matchFilters) cmd += ` --match-filters "${data.matchFilters}"`;
  
  // Video Selection
  if (data.playlistItems) cmd += ` -I "${data.playlistItems}"`;
  if (data.date) cmd += ` --date "${data.date}"`;
  if (data.datebefore) cmd += ` --datebefore "${data.datebefore}"`;
  if (data.dateafter) cmd += ` --dateafter "${data.dateafter}"`;
  if (data.minFilesize) cmd += ` --min-filesize ${data.minFilesize}`;
  if (data.maxFilesize) cmd += ` --max-filesize ${data.maxFilesize}`;
  if (data.maxDownloads) cmd += ` --max-downloads ${data.maxDownloads}`;
  if (data.ageLimit) cmd += ` --age-limit ${data.ageLimit}`;
  if (data.downloadArchive) cmd += ` --download-archive "${data.downloadArchive}"`;
  if (data.noPlaylist) cmd += ' --no-playlist';
  if (data.playlistRandom) cmd += ' --playlist-random';
  if (data.playlistReverse) cmd += ' --playlist-reverse';
  
  // Format Selection
  if (workflow !== 'audio') {
    if (data.format && data.format !== 'best') {
      if (data.format === 'custom') {
        // Custom format - user enters manually
      } else {
        cmd += ` -f "${data.format}"`;
      }
    }
    if (data.formatSort) cmd += ` --format-sort "${data.formatSort}"`;
    if (data.mergeOutputFormat) cmd += ` --merge-output-format ${data.mergeOutputFormat}`;
    if (data.preferFreeFormats) cmd += ' --prefer-free-formats';
  }
  
  // Audio Extraction
  if (data.extractAudio || workflow === 'audio') {
    cmd += ' -x';
    if (data.audioFormat) cmd += ` --audio-format ${data.audioFormat}`;
    if (data.audioQuality) cmd += ` --audio-quality ${data.audioQuality}`;
    if (data.keepVideo) cmd += ' --keep-video';
  }
  
  // Subtitles
  if (data.writeSubs) cmd += ' --write-subs';
  if (data.writeAutoSubs) cmd += ' --write-auto-subs';
  if (data.subLangs) cmd += ` --sub-langs "${data.subLangs}"`;
  if (data.embedSubs) cmd += ' --embed-subs';
  if (data.convertSubs) cmd += ` --convert-subs ${data.convertSubs}`;
  
  // Thumbnails
  if (data.writeThumbnail) cmd += ' --write-thumbnail';
  if (data.embedThumbnail) cmd += ' --embed-thumbnail';
  if (data.convertThumbnails) cmd += ` --convert-thumbnails ${data.convertThumbnails}`;
  
  // Output Template
  if (data.outputTemplate) cmd += ` -o "${data.outputTemplate}"`;
  if (data.outputPath) cmd += ` -P "${data.outputPath}"`;
  if (data.outputNaPlaceholder && data.outputNaPlaceholder !== 'NA') cmd += ` --output-na-placeholder "${data.outputNaPlaceholder}"`;
  if (data.restrictFilenames) cmd += ' --restrict-filenames';
  if (data.windowsFilenames) cmd += ' --windows-filenames';
  if (data.trimFilenames) cmd += ` --trim-filenames ${data.trimFilenames}`;
  if (data.noOverwrites) cmd += ' -w';
  if (!data.continueDL) cmd += ' --no-continue';
  if (!data.part) cmd += ' --no-part';
  if (data.mtime) cmd += ' --mtime';
  
  // Files
  if (data.writeDescription) cmd += ' --write-description';
  if (data.writeInfoJson) cmd += ' --write-info-json';
  if (data.writeComments) cmd += ' --write-comments';
  if (data.cleanInfoJson) cmd += ' --clean-info-json';
  
  // Network
  if (data.proxy) cmd += ` --proxy "${data.proxy}"`;
  if (data.socketTimeout) cmd += ` --socket-timeout ${data.socketTimeout}`;
  if (data.sourceAddress) cmd += ` --source-address "${data.sourceAddress}"`;
  if (data.impersonate) cmd += ` --impersonate ${data.impersonate}`;
  if (data.forceIpv4) cmd += ' -4';
  if (data.forceIpv6) cmd += ' -6';
  if (data.referer) cmd += ` --referer "${data.referer}"`;
  if (data.cookies) cmd += ` --cookies "${data.cookies}"`;
  if (data.cookiesFromBrowser) cmd += ` --cookies-from-browser ${data.cookiesFromBrowser}`;
  
  // Download Options
  if (data.concurrentFragments > 1) cmd += ` -N ${data.concurrentFragments}`;
  if (data.limitRate) cmd += ` -r ${data.limitRate}`;
  if (data.retries && data.retries !== 10) cmd += ` -R ${data.retries}`;
  if (data.noContinue) cmd += ' --no-continue';
  if (data.noPart) cmd += ' --no-part';
  if (data.bufferSize) cmd += ` --buffer-size ${data.bufferSize}`;
  if (data.hlsUseMpegts) cmd += ' --hls-use-mpegts';
  if (data.downloadSections) cmd += ` --download-sections "${data.downloadSections}"`;
  
  // Chapters
  if (data.splitChapters) cmd += ' --split-chapters';
  if (data.chaptersStart) cmd += ` --download-sections "*${data.chaptersStart}"`;
  if (data.chaptersEnd) cmd += `--download-sections "*:${data.chaptersEnd}"`;
  if (data.chaptersName) cmd += ` -o "${data.chaptersName}.%(ext)s"`;
  
  // Auth
  if (data.username) cmd += ` --username "${data.username}"`;
  if (data.password) cmd += ` --password "${data.password}"`;
  if (data.twofactor) cmd += ` --twofactor "${data.twofactor}"`;
  if (data.videoPassword) cmd += ` --video-password "${data.videoPassword}"`;
  if (data.netrc) cmd += ' --netrc';
  if (data.netrcLocation) cmd += ` --netrc-location "${data.netrcLocation}"`;
  
  // Metadata
  if (data.embedMetadata) cmd += ' --embed-metadata';
  if (data.metadataFromTitle) cmd += ` --metadata-from-title "${data.metadataFromTitle}"`;
  if (data.parseMetadata) cmd += ` --parse-metadata "${data.parseMetadata}"`;
  if (data.embedChapters) cmd += ' --embed-chapters';
  if (data.addMetadata) cmd += ' --add-metadata';
  if (data.addChapters) cmd += ' --add-chapters';
  
  // SponsorBlock
  if (data.sponsorblockMark) cmd += ` --sponsorblock-mark ${data.sponsorblockMark}`;
  if (data.sponsorblockRemove) cmd += ` --sponsorblock-remove ${data.sponsorblockRemove}`;
  if (data.sponsorblockChapters) cmd += ' --sponsorblock-chapters-title';
  
  // Advanced
  if (data.quiet) cmd += ' -q';
  if (data.noWarnings) cmd += ' --no-warnings';
  if (data.simulate) cmd += ' -s';
  if (data.dumpJson) cmd += ' --dump-json';
  if (data.dumpSingleJson) cmd += ' --dump-single-json';
  if (data.verbose) cmd += ' --verbose';
  if (data.forceDownloadArchive) cmd += ' --force-download-archive';
  if (data.ffmpegLocation) cmd += ` --ffmpeg-location "${data.ffmpegLocation}"`;
  if (data.remuxVideo) cmd += ` --remux-video ${data.remuxVideo}`;
  if (data.recodeVideo) cmd += ` --recode-video ${data.recodeVideo}`;
  if (data.postProcessorArgs) cmd += ` --post-processor-args "${data.postProcessorArgs}"`;
  
  return cmd;
}
