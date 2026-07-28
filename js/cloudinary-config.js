/* ============================================================
   CLOUDINARY CONFIG  (SS Renovations Group photo uploads)
   ------------------------------------------------------------
   Cole aqui os 2 valores da sua conta Cloudinary (gratuita).
   Enquanto estiverem vazios, o site funciona normal só com as
   fotos locais; o painel /admin mostra as instruções de setup.

   COMO PEGAR (2 minutos):
   1. Crie uma conta grátis em https://cloudinary.com
   2. No Dashboard, copie o "Cloud name"  -> cole em cloudName
   3. Settings > Upload > Add upload preset:
        - Signing Mode: Unsigned
        - salve e copie o nome do preset -> cole em uploadPreset
   4. Settings > Security > marque "Resource list" como permitido
      (necessário para a galeria listar as fotos enviadas)
   ============================================================ */
window.SSG_CLOUDINARY = {
  cloudName:    "buzxabtw",   // Cloudinary cloud name
  uploadPreset: "gezcreuj",   // unsigned upload preset
  tagPrefix:    "ssg_" // categoria vira tag: ssg_kitchens, ssg_bathrooms...
};
window.SSG_CLOUDINARY.ready = !!(window.SSG_CLOUDINARY.cloudName && window.SSG_CLOUDINARY.uploadPreset);
