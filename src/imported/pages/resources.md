---
layout: layouts/base.njk
title: Recursos barefoot
description: "Guías prácticas de Isabel para empezar con zapatos barefoot: transición, talla, ajuste, tipo de pie, dolor, cuidado y compras inteligentes."
date: '2020-06-14T17:35:45'
permalink: /resources/
sourceType: Página
contentType: Página
sourceId: 6603
sourceSlug: resources
sourceModified: '2024-07-11T20:37:36'
image: "/assets/generated/featured/pages/resources.jpg"
imageAlt: "Imagen destacada de Recursos barefoot"
pageClass: resources-page
tags:
- traducido
language: es
translatedFrom: en
---
{% set resourcePosts = collections.importedPosts | resourcePosts %}
{% set featured = resourcePosts.slice(0, 6) %}
{% set latest = resourcePosts.slice(6) %}

<section class="style-hero">
  <div class="style-hero__copy">
    <p class="eyebrow">Recursos barefoot</p>
    <h1>Guías para elegir barefoot sin perderte.</h1>
    <p>Una biblioteca práctica de Isabel para entender tallas, tipos de pie, transición, ajuste, movimiento y compras inteligentes antes de lanzarte a por tu siguiente par.</p>
    <div class="button-row">
      <a class="button" href="#guias-recursos">Ver recursos</a>
      <a class="button secondary" href="/barefoot-shoes-faq/">Resolver dudas</a>
    </div>
  </div>
  <div class="style-hero__media">
    <img src="/assets/generated/featured/pages/resources.jpg" alt="Composicion editorial de recursos barefoot" loading="eager">
  </div>
</section>

<section class="style-categories" aria-label="Categorias de recursos">
  <a href="/benefits-barefoot-minimalist-shoes/">
    <span>Empezar</span>
    <strong>Qué es barefoot y por qué importa</strong>
  </a>
  <a href="/best-barefoot-shoes-foot-type/">
    <span>Tipo de pie</span>
    <strong>Elige marcas según tu forma</strong>
  </a>
  <a href="/how-do-i-know-if-my-shoes-fit/">
    <span>Ajuste</span>
    <strong>Talla, ancho y volumen</strong>
  </a>
  <a href="/foot-exercises-transitioning-barefoot-shoes/">
    <span>Transición</span>
    <strong>Ejercicios y adaptación</strong>
  </a>
  <a href="/how-do-i-know-if-my-shoes-fit/">
    <span>Compras</span>
    <strong>Comprar con criterio de ajuste</strong>
  </a>
  <a href="/barefoot-shoes-faq/">
    <span>FAQ</span>
    <strong>Dudas antes de comprar</strong>
  </a>
</section>

<section class="section" id="guias-recursos">
  <div class="section-head">
    <div>
      <p class="eyebrow">Destacados</p>
      <h2>Lo primero que leería Isabel.</h2>
    </div>
    <p>Guías para tomar mejores decisiones: entender tu pie, comprar con cabeza y no hacer una transición a lo loco.</p>
  </div>
  <div class="section-inner style-featured-grid">
    {% for post in featured %}
      <article class="post-card {% if loop.first %}post-card--lead{% endif %}">
        <a href="{{ post.url }}">
          <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy">
          <div class="post-card-content">
            <div class="post-meta">
              <span>{{ post.data.contentType or "Guía" }}</span>
              <time datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
            </div>
            <h3>{{ post.data.title }}</h3>
            <p>{{ post.data.description }}</p>
          </div>
        </a>
      </article>
    {% endfor %}
  </div>
</section>

<section class="style-band">
  <div>
    <p class="eyebrow">Mapa rápido</p>
    <h2>Si estás empezando, no leas al azar.</h2>
    <p>Estas piezas funcionan como puerta de entrada: primero concepto, después ajuste, luego tipo de pie y finalmente transición.</p>
  </div>
  <div class="style-link-list">
    <a href="/ufaq/whats-the-difference-between-barefoot-minimalist-natural-footwear/">Qué es un zapato barefoot</a>
    <a href="/benefits-barefoot-minimalist-shoes/">Por qué pasarse al barefoot</a>
    <a href="/how-do-i-know-if-my-shoes-fit/">Cómo saber si te queda bien</a>
    <a href="/best-barefoot-shoes-foot-type/">Zapatos según tu tipo de pie</a>
  </div>
</section>

<section class="section">
  <div class="section-head">
    <div>
      <p class="eyebrow">Biblioteca</p>
      <h2>Más recursos para consultar.</h2>
    </div>
    <p>{{ resourcePosts.length }} artículos sobre ajuste, salud del pie, transición, compras y dudas frecuentes.</p>
  </div>
  <div class="section-inner archive-grid style-post-grid">
    {% for post in latest %}
      <article class="post-card">
        <a href="{{ post.url }}">
          <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy">
          <div class="post-card-content">
            <div class="post-meta">
              <time datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
            </div>
            <h3>{{ post.data.title }}</h3>
            <p>{{ post.data.description }}</p>
          </div>
        </a>
      </article>
    {% endfor %}
  </div>
</section>
