---
layout: layouts/base.njk
templateEngineOverride: njk
title: Recursos barefoot
description: "Guías prácticas de Isabel para empezar con zapatos barefoot: transición, talla, ajuste, tipo de pie, dolor, cuidado y compras inteligentes."
date: '2020-06-14T17:35:45'
permalink: /resources/
sourceType: Página
contentType: Página
sourceId: 6603
sourceSlug: resources
sourceModified: '2026-07-14T00:00:00'
image: "/assets/generated/featured/pages/resources.jpg"
imageAlt: "Guías y recursos de calzado barefoot"
pageClass: resources-page resource-index
tags:
- traducido
language: es
translatedFrom: en
---
{% set resourcePosts = collections.resourcePosts %}

<section class="resource-index__hero">
  <div class="resource-index__hero-inner">
    <p class="eyebrow">Biblioteca práctica · {{ resourcePosts.length }} guías</p>
    <h1>Guías barefoot</h1>
    <p>Empieza por entender tus pies y avanza con criterio. Aquí reúno las guías sobre talla, ajuste, transición, movimiento y compra que conviene leer antes de elegir otro par.</p>
  </div>
</section>

<nav class="resource-paths" aria-label="Rutas de aprendizaje barefoot">
  <a href="/preguntas/diferencia-barefoot-minimalistas-natural/">
    <span>01</span>
    <strong>Entender el barefoot</strong>
    <small>Conceptos y diferencias básicas</small>
  </a>
  <a href="/preguntas/como-medir-pies-elegir-talla/">
    <span>02</span>
    <strong>Medir y elegir talla</strong>
    <small>Longitud, anchura y espacio</small>
  </a>
  <a href="/mejores-marcas-zapatos-pie-tipo-pie/">
    <span>03</span>
    <strong>Conocer tu tipo de pie</strong>
    <small>Forma, volumen y ajuste</small>
  </a>
  <a href="/sencillos-ejercicios-pie-transicion-barefoot/">
    <span>04</span>
    <strong>Hacer la transición</strong>
    <small>Adaptación progresiva y movimiento</small>
  </a>
</nav>

<section class="resource-library" aria-labelledby="resource-library-title">
  <header class="resource-library__head">
    <div>
      <p class="eyebrow">Todas las guías</p>
      <h2 id="resource-library-title">Lee según lo que necesites ahora</h2>
    </div>
    <p>Página 1 de {{ resourcePosts.length | pageNumbers(24) | length }}</p>
  </header>

  <div class="resource-library__grid">
    {% for post in resourcePosts %}{% if loop.index <= 24 %}
      <article class="resource-card">
        <a href="{{ post.url }}">
          <div class="resource-card__image">
            {% if post.data.image %}<img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy" width="720" height="450">{% endif %}
          </div>
          <div class="resource-card__body">
            <time datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
            <h3>{{ post.data.title }}</h3>
            {% if post.data.description %}<p>{{ post.data.description | cleanSummary }}</p>{% endif %}
            <span class="resource-card__link">Leer la guía</span>
          </div>
        </a>
      </article>
    {% endif %}{% endfor %}
  </div>

  <nav class="pagination-nav" aria-label="Paginación de guías">
    <span class="pagination-nav__disabled">Anterior</span>
    {% for pageNumber in resourcePosts.length | pageNumbers(24) %}
      <a href="{{ pageNumber | guidePageUrl }}"{% if pageNumber == 1 %} aria-current="page"{% endif %}>{{ pageNumber }}</a>
    {% endfor %}
    {% if resourcePosts.length > 24 %}<a href="/recursos/pagina/2/">Siguiente</a>{% else %}<span class="pagination-nav__disabled">Siguiente</span>{% endif %}
  </nav>
</section>
