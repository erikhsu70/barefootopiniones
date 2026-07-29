---
layout: layouts/base.njk
templateEngineOverride: njk
title: Barefoot Opiniones
description: Guías, opiniones y comparativas de Isabel para elegir zapatos barefoot bonitos, cómodos y con forma de pie.
date: '2020-06-14T15:52:30'
permalink: /
sourceType: Página
contentType: Página
sourceId: 6509
sourceSlug: home
sourceModified: '2026-07-13T00:00:00'
image: "/assets/images/home/hero.jpg"
imageAlt: "Barefoot Opiniones, la guía barefoot de Isabel"
pageClass: lovable-home
tags:
- traducido
language: es
translatedFrom: en
---
{% set featured = collections.importedPosts | featuredPosts %}
{% set heroPost = featured[0] %}
{% set secondaryPosts = featured.slice(1, 5) %}
{% set latestPosts = collections.importedPosts.slice(0, 3) %}
{% set featuredImages = ["/assets/images/home/feat-1.jpg", "/assets/images/home/feat-2.jpg", "/assets/images/home/feat-3.jpg", "/assets/images/home/feat-4.jpg"] %}
{% set latestImages = ["/assets/images/home/latest-1.jpg", "/assets/images/home/latest-2.jpg", "/assets/images/home/latest-3.jpg"] %}

<section class="lov-home-hero">
  <div class="lov-home-hero__inner">
    <div class="lov-home-hero__copy">
      <h1>Barefoot Opiniones</h1>
      <p class="lov-home-hero__intro">Guías, opiniones y comparativas de calzado barefoot editadas por Isabel. Sin postureo ni patrocinios ocultos: información clara para caminar con los pies libres.</p>
      <div class="button-row">
        <a class="button" href="/articulos/">Explorar artículos →</a>
        <a class="button secondary" href="/categoria/primeros-pasos/">Empezar desde cero</a>
      </div>
    </div>
    {% if heroPost %}
      <a class="lov-home-feature" href="{{ heroPost.url }}">
        <img src="/assets/images/home/hero.jpg" alt="{{ heroPost.data.imageAlt or heroPost.data.title }}" fetchpriority="high">
        <span class="lov-home-feature__caption"><span>Destacado</span><strong>{{ heroPost.data.title }}</strong></span>
      </a>
    {% endif %}
  </div>
</section>

<section class="lov-band">
  <div class="lov-section">
    <div class="lov-section-head">
      <div><p class="eyebrow">Explora por temática</p><h2>Nueve caminos para elegir bien</h2></div>
      <a href="/articulos/">Ver todo</a>
    </div>
    <div class="lov-topic-grid">
      {% for topic in blogTopics.categories %}
        {% set topicCount = (collections.importedPosts | topicPosts(topic)).length %}
        <a class="lov-topic-card" href="{{ topic.url }}">
          <span class="lov-topic-card__top"><span>{{ topic.eyebrow }}</span><small>{{ topicCount }} artículos</small></span>
          <strong>{{ topic.label }}</strong>
          <p>{{ topic.description }}</p>
          <b>Explorar →</b>
        </a>
      {% endfor %}
    </div>
  </div>
</section>

{% if secondaryPosts.length %}
<section class="lov-section">
  <div class="lov-section-head"><div><p class="eyebrow">Selección de Isabel</p><h2>Lo que estoy usando ahora mismo</h2></div></div>
  <div class="lov-feature-grid">
    {% for post in secondaryPosts %}
      <a class="lov-media-card" href="{{ post.url }}">
        <div class="lov-media-card__image"><img src="{{ featuredImages[loop.index0] or post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy"></div>
        <time class="lov-card-date" datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
        <h3>{{ post.data.title }}</h3>
        <p>{{ post.data.description }}</p>
      </a>
    {% endfor %}
  </div>
</section>
{% endif %}

<section class="lov-band">
  <div class="lov-section">
    <div class="lov-section-head"><h2>Últimos artículos</h2><a href="/articulos/">Ver todos ({{ collections.importedPosts.length }})</a></div>
    <div class="lov-latest-grid">
      {% for post in latestPosts %}
        <a class="lov-media-card" href="{{ post.url }}">
          <div class="lov-media-card__image"><img src="{{ latestImages[loop.index0] or post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy"></div>
          <time class="lov-card-date" datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
          <h3>{{ post.data.title }}</h3>
        </a>
      {% endfor %}
    </div>
  </div>
</section>
