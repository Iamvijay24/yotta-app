import { WebView } from 'react-native-webview';
import { View } from 'react-native';

import { styles } from '../styles';

const VideoAIOverlay = ({ webViewRef, currentTopicIndex, onMessage }) => (
  <View style={styles.aiOverlay}>
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      thirdPartyCookiesEnabled
      databaseEnabled
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      mixedContentMode="always"
      androidLayerType="hardware"
      onMessage={onMessage}
      source={{
        html: `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
      html, body {
        margin: 0; padding: 0;
        height: 100vh; width: 100vw;
        background-color: #000;
        overflow: hidden;
      }
      #fb-widget-config {
        width: 100% !important;
        height: 100% !important;
        position: absolute; top: 0; left: 0;
      }
      div[class*="widget-container"], .fb-avatar-container, [class*="MainContainer"] {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        border-radius: 0 !important;
      }
    </style>
  </head>
  <body>
    <div id="fb-widget-config"></div>
    <script src="https://d3cz62hdgxo8h8.cloudfront.net/ai_widget.latest.js"></script>
    <script>
      (function() {
        var check = setInterval(function() {
          if (window.ai_tutor) {
            clearInterval(check);
            window.ai_tutor.init(
              'fb-vibe-coding-lesson-${currentTopicIndex + 1}',
              '5118f0d9',
              'vibe-coding-lesson-${currentTopicIndex + 1}'
            ).then(function() {
              window.ai_tutor.open();
              setTimeout(function() {
                window.ReactNativeWebView.postMessage('READY');
              }, 2000);

              document.addEventListener('click', function(e) {
                var target = e.target;
                var isCloseButton = target.closest('[class*="close"]') ||
                                    target.innerText === '×' ||
                                    target.getAttribute('aria-label') === 'Close';
                if (isCloseButton) {
                  window.ReactNativeWebView.postMessage('CLOSE_WIDGET');
                }
              });
            });
          }
        }, 500);
      })();
    </script>
  </body>
</html>
`,
        baseUrl: 'https://d3cz62hdgxo8h8.cloudfront.net/',
      }}
      style={{ flex: 1 }}
    />
  </View>
);

export default VideoAIOverlay;
