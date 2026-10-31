"use strict";

// تحديث السنة تلقائيًا
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// إظهار العناصر بحركة خفيفة أثناء التمرير
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (
  !reducedMotion.matches &&
  "IntersectionObserver" in window
) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.remove("is-pending");
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("is-pending");
    observer.observe(element);
  });
}

// تشغيل فيديو واحد فقط في كل مرة
const videos = document.querySelectorAll(".video-card video");

videos.forEach((currentVideo) => {
  currentVideo.addEventListener("play", () => {
    videos.forEach((otherVideo) => {
      if (otherVideo !== currentVideo) {
        otherVideo.pause();
      }
    });
  });
});

// إيقاف الفيديوهات عند مغادرة التبويب
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    videos.forEach((video) => video.pause());
  }
});







  document.querySelectorAll(".video-card video").forEach((video) => {
    const showPreview = () => {
      // لا تغيّر التوقيت إذا بدأ المستخدم المشاهدة بالفعل.
      if (!video.paused || video.currentTime > 0) return;

      const previewTime = Number.isFinite(video.duration)
        ? Math.min(0.1, video.duration / 2)
        : 0.1;

      video.currentTime = previewTime;
    };

    if (video.readyState >= 1) {
      showPreview();
    } else {
      video.addEventListener("loadedmetadata", showPreview, {
        once: true
      });
    }
  });
