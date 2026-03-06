# MAD-complaints-widget

Widget integration code:

```
<!-- Complaints Widget -->
<script src="https://mad-software-as.github.io/complaints-widget/widget.min.js"></script>
<script>
  window.onload = () => {
    widget = window.MAD_COMPLAINTS_WIDGET({
      targetId: 'mad-complaints-widget', // id to render
      chainId: '', // Chain id
      env: 'dev',
      // redirectPath: '', // applies redirect after submit
      // global theme override/customization
      // cssVars: {
      //   bgDefault: '#1E3148',
      //   bgAccent: 'rgba(255, 255, 255, 0.04)',
      //   borderColor: 'rgba(255, 255, 255, 0.1)',
      //   textColorDefault: 'white',
      //   textColorPlaceholder: '#6B7280',
      //   fontSizeDefault: '15px',
      //   lineHeightDefault: '20px',
      //   borderRadiusDefault: '12px',
      //   borderRadiusSm: '4px',
      //   calendarIconInvert: 'invert(0.8)'
      // }
    });
  }
</script>
<!-- End Complaints Widget -->
```

Widget render:
```<div id="mad-complaints-widget"></div>```
