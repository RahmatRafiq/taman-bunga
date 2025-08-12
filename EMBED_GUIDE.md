# Virtual Tour Responsive Embed Guide

## Cara Embed Virtual Tour di Aplikasi Lain

### 1. Menggunakan Iframe Standar

```html
<iframe 
    src="https://your-domain.com/embed/tour/27" 
    width="100%" 
    height="400"
    frameborder="0" 
    allowfullscreen
    style="min-height: 300px; max-height: 80vh;">
</iframe>
```

### 2. Menggunakan Component React (Recommended)

Jika aplikasi Anda menggunakan React, gunakan component `ResponsiveIframe`:

```jsx
import ResponsiveIframe from './components/ResponsiveIframe'

function MyComponent() {
    return (
        <ResponsiveIframe 
            src="https://your-domain.com/embed/tour/27"
            title="Virtual Tour - University Campus"
            className="rounded-lg shadow-lg"
            allowFullScreen={true}
        />
    )
}
```

### 3. Responsive CSS untuk Iframe

Jika menggunakan iframe standar, tambahkan CSS ini untuk responsivitas:

```css
.responsive-iframe-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    overflow: hidden;
}

.responsive-iframe-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .responsive-iframe-container {
        padding-bottom: 75%; /* 4:3 aspect ratio for mobile */
        min-height: 300px;
    }
}
```

### 4. JavaScript untuk Auto-resize

Untuk iframe yang bisa menyesuaikan ukuran secara otomatis:

```javascript
// Listen for resize messages from the iframe
window.addEventListener('message', function(event) {
    if (event.data?.type === 'tour-resize') {
        const iframe = document.getElementById('virtual-tour-iframe')
        if (iframe) {
            const { width, height } = event.data
            const aspectRatio = width / height
            const containerWidth = iframe.parentElement.offsetWidth
            const newHeight = Math.min(containerWidth / aspectRatio, window.innerHeight * 0.8)
            
            iframe.style.height = newHeight + 'px'
        }
    }
})
```

### 5. Optimasi untuk Mobile

#### Viewport Meta Tag
Pastikan halaman yang mengembeds tour memiliki viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

#### Touch-friendly Controls
Virtual tour sudah dioptimasi untuk touch, tetapi pastikan tidak ada konflik dengan gestures halaman induk:

```css
.tour-container {
    touch-action: none; /* Mencegah konflik gesture */
    -webkit-overflow-scrolling: touch;
}
```

### 6. Loading State

Tambahkan loading indicator saat iframe belum selesai dimuat:

```html
<div id="tour-loading" style="display: flex; align-items: center; justify-content: center; height: 400px; background: #f3f4f6;">
    <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 3px solid #ddd; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
        <p>Loading Virtual Tour...</p>
    </div>
</div>

<iframe 
    id="virtual-tour-iframe"
    src="https://your-domain.com/embed/tour/27" 
    width="100%" 
    height="400"
    frameborder="0" 
    allowfullscreen
    onload="document.getElementById('tour-loading').style.display='none'"
    style="display: none; min-height: 300px;">
</iframe>

<script>
document.getElementById('virtual-tour-iframe').onload = function() {
    document.getElementById('tour-loading').style.display = 'none'
    this.style.display = 'block'
}
</script>
```

### 7. URL Parameters

Anda bisa menambahkan parameter untuk kustomisasi:

```
https://your-domain.com/embed/tour/27?autoplay=false&showinfo=true&sphere=2
```

Parameter yang tersedia:
- `autoplay`: true/false - Auto rotate sphere
- `showinfo`: true/false - Tampilkan info overlay
- `sphere`: number - Index sphere yang akan ditampilkan pertama
- `controls`: true/false - Tampilkan navigation controls

### 8. Security Considerations

Untuk keamanan, pastikan iframe menggunakan sandbox attributes yang sesuai:

```html
<iframe 
    src="https://your-domain.com/embed/tour/27"
    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    width="100%" 
    height="400">
</iframe>
```

### 9. Performance Tips

1. **Lazy Loading**: Gunakan `loading="lazy"` pada iframe
2. **DNS Prefetch**: Tambahkan `<link rel="dns-prefetch" href="https://your-domain.com">`
3. **Preconnect**: Tambahkan `<link rel="preconnect" href="https://your-domain.com">`

### 10. Error Handling

Tambahkan fallback jika iframe gagal dimuat:

```html
<div class="tour-container">
    <iframe 
        src="https://your-domain.com/embed/tour/27"
        onerror="showTourError()"
        width="100%" 
        height="400">
        <p>Your browser doesn't support iframes. <a href="https://your-domain.com/tour/27" target="_blank">Open Virtual Tour in new window</a></p>
    </iframe>
</div>

<script>
function showTourError() {
    document.querySelector('.tour-container').innerHTML = 
        '<div style="padding: 20px; text-align: center; background: #fee; border: 1px solid #fcc;">' +
        '<p>Unable to load virtual tour. <a href="https://your-domain.com/tour/27" target="_blank">Click here to open in new window</a></p>' +
        '</div>'
}
</script>
```

## Testing Responsiveness

Untuk menguji responsivitas virtual tour:

1. Buka di berbagai ukuran layar (desktop, tablet, mobile)
2. Test di berbagai browser (Chrome, Firefox, Safari, Edge)
3. Test orientasi portrait dan landscape pada mobile
4. Test pada perangkat dengan DPI tinggi
5. Test kecepatan loading pada koneksi lambat

## Troubleshooting

### Masalah Umum:

1. **Tour tidak responsive**: Pastikan CSS responsive telah diterapkan
2. **Loading lambat**: Optimasi gambar dan gunakan lazy loading
3. **Tidak bisa touch/drag**: Periksa konflik CSS touch-action
4. **Iframe tidak muncul**: Periksa CORS dan X-Frame-Options headers
5. **Kontrol terlalu kecil di mobile**: Gunakan CSS media queries untuk memperbesar kontrol

### Debug Mode:

Tambahkan `?debug=true` pada URL embed untuk melihat informasi debug di console browser.
