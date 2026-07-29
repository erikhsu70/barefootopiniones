---
layout: layouts/base.njk
templateEngineOverride: njk
title: Opiniones barefoot
description: Opiniones de Isabel sobre marcas y modelos barefoot, minimalistas y de puntera ancha.
date: '2020-06-14T17:26:49'
permalink: /reviews/
sourceType: Página
contentType: Página
sourceId: 6592
sourceSlug: reviews
sourceModified: '2024-07-11T20:37:57'
image: "/assets/generated/featured/pages/reviews.jpg"
imageAlt: "Imagen destacada de opiniones barefoot"
pageClass: reviews-page
tags:
- traducido
language: es
translatedFrom: en
---
{% set reviewPosts = collections.importedPosts | postsMatchingPatterns(["review", "opinión", "opinion", "reviews"]) %}
{% set featured = reviewPosts.slice(0, 9) %}

{% set hubPosts = reviewPosts %}
{% set hubEyebrow = "Opiniones barefoot" %}
{% set hubTitle = "Opiniones de zapatos barefoot, claras y navegables" %}
{% set hubDescription = "Análisis de modelos, marcas y comparativas para entender ajuste, flexibilidad, anchura, materiales y uso antes de comprar." %}
{% set hubListTitle = "Todas las opiniones" %}
{% include "components/lovable-hub.njk" %}
{% if false %}

<section class="page-content blog-page reviews-hub">
  <section class="blog-dashboard">
    <div class="blog-dashboard__copy">
      <p class="eyebrow">Reseñas barefoot</p>
      <h1>Opiniones de zapatos barefoot, claras y navegables.</h1>
      <p>Pruebas de modelos concretos, marcas y comparativas para entender ajuste, flexibilidad, anchura, materiales y uso real antes de comprar.</p>
    </div>
    <div class="mirror-stats blog-stats">
      <div><strong>{{ reviewPosts.length }}</strong><span>Reseñas</span></div>
      <div><strong>0</strong><span>Vídeos</span></div>
      <div><strong>1</strong><span>Archivo</span></div>
    </div>
  </section>

  <section class="blog-featured">
    {% for post in featured %}
      <article class="post-card {% if loop.first %}post-card--lead{% endif %}">
        <a href="{{ post.url }}">
          {% if post.data.image %}
            <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="{% if loop.first %}eager{% else %}lazy{% endif %}">
          {% endif %}
          <div class="post-card-content">
            <div class="post-meta">
              <span>Reseña</span>
              <time datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
            </div>
            <h3>{{ post.data.title }}</h3>
            {% if post.data.description %}
              <p>{{ post.data.description | safe }}</p>
            {% endif %}
          </div>
        </a>
      </article>
    {% endfor %}
  </section>

  <section class="home-route-grid" aria-label="Atajos de reseñas">
    <a class="home-route home-route--large" href="/mujeres/">
      <span>Mujer</span>
      <strong>Reseñas y guías de mujer</strong>
      <small>Zapatos bonitos, botas, sandalias, bailarinas y modelos arreglados.</small>
    </a>
    <a class="home-route" href="/ninos/">
      <span>Niños</span>
      <strong>Zapatos infantiles</strong>
      <small>Modelos flexibles y resistentes para pies en crecimiento.</small>
    </a>
    <a class="home-route" href="/mejores-zapatos-barefoot/">
      <span>Listas</span>
      <strong>Comparativas por uso</strong>
      <small>Cuando necesitas ver varias opciones juntas.</small>
    </a>
    <a class="home-route" href="/estilo/">
      <span>Estilo</span>
      <strong>Looks barefoot</strong>
      <small>Alternativas más bonitas y cómodas a zapatos estrechos.</small>
    </a>
  </section>

  <section class="topic-section">
    <div class="section-head topic-head">
      <div>
        <p class="eyebrow">Archivo de reseñas</p>
        <h2>Todas las reseñas</h2>
      </div>
      <p>{{ reviewPosts.length }} artículos ordenados como blog, sin filtros importados ni barras raras.</p>
    </div>
    <div class="archive-grid topic-grid">
      {% for post in reviewPosts %}
        <article class="post-card">
          <a href="{{ post.url }}">
            {% if post.data.image %}
              <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy">
            {% endif %}
            <div class="post-card-content">
              <div class="post-meta">
                <span>Reseña</span>
                <time datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
              </div>
              <h3>{{ post.data.title }}</h3>
              {% if post.data.description %}
                <p>{{ post.data.description | safe }}</p>
              {% endif %}
            </div>
          </a>
        </article>
      {% endfor %}
    </div>
  </section>
</section>
{% endif %}
