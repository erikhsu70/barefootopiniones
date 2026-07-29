---
layout: layouts/base.njk
templateEngineOverride: njk
title: Niños
description: Guías, listas y opiniones para elegir zapatos barefoot infantiles sin perderse entre tallas, estaciones y usos.
date: '2022-12-15T22:47:29'
permalink: /kids/
sourceType: Página
contentType: Página
sourceId: 24981
sourceSlug: kids
sourceModified: '2024-02-06T19:17:22'
image: "/assets/generated/featured/pages/kids.jpg"
imageAlt: "Imagen destacada de zapatos barefoot para niños"
tags:
- traducido
language: es
translatedFrom: en
---
{% set kidsPosts = collections.importedPosts | kidsPosts %}
{% set kidsFeatured = kidsPosts.slice(0, 9) %}
{% set kidsTopics = [
  {
    key: "primeros-pasos",
    label: "Primeros pasos",
    eyebrow: "Para empezar",
    description: "Cómo elegir la primera pareja, medir pies infantiles y entender cuándo toca cambiar de talla.",
    patterns: ["first", "primer", "measure", "measuring", "size", "fit", "baby", "toddler"]
  },
  {
    key: "listas-ninos",
    label: "Listas infantiles",
    eyebrow: "Decidir rápido",
    description: "Recopilatorios por temporada, edad y uso para encontrar opciones sin revisar todo el blog.",
    patterns: ["best", "complete-list", "favorites", "kids-shoes", "school", "back-to-school", "sandals", "boots"]
  },
  {
    key: "colegio-y-dia-a-dia",
    label: "Colegio y diario",
    eyebrow: "Uso real",
    description: "Zapatos resistentes para clase, parque, lluvia, barro y peques que no paran quietos.",
    patterns: ["school", "casual", "rain", "waterproof", "winter", "durable", "play"]
  },
  {
    key: "marcas-infantiles",
    label: "Marcas y reseñas",
    eyebrow: "Probados",
    description: "Opiniones de marcas infantiles y modelos concretos, con foco en anchura, flexibilidad y ajuste.",
    patterns: ["review", "little-love-bug", "ten-little", "bobux", "plae", "zuna", "splay", "tikki"]
  }
] %}

{% set hubPosts = kidsPosts %}
{% set hubEyebrow = "Niños barefoot" %}
{% set hubTitle = "Zapatos infantiles con espacio para crecer y moverse" %}
{% set hubDescription = "Guías, listas y opiniones para elegir calzado flexible, cómodo y con forma de pie para bebés, peques y niños mayores." %}
{% set hubListTitle = "Todos los artículos de niños" %}
{% include "components/lovable-hub.njk" %}
{% if false %}

<section class="page-content blog-page kids-hub">
  <section class="blog-dashboard kids-dashboard">
    <div class="blog-dashboard__copy">
      <p class="eyebrow">Niños barefoot</p>
      <h1>Zapatos infantiles con espacio para crecer y moverse.</h1>
      <p>Guías, listas y opiniones para elegir calzado flexible, cómodo y con forma de pie para bebés, peques y niños mayores.</p>
    </div>
    <div class="mirror-stats blog-stats">
      <div><strong>{{ kidsPosts.length }}</strong><span>Artículos</span></div>
      <div><strong>{{ kidsTopics.length }}</strong><span>Rutas</span></div>
      <div><strong>{{ collections.importedFaqs.length }}</strong><span>FAQs</span></div>
    </div>
  </section>

  <section class="blog-featured">
    {% for post in kidsFeatured %}
      <article class="post-card {% if loop.first %}post-card--lead{% endif %}">
        <a href="{{ post.url }}">
          {% if post.data.image %}
            <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="{% if loop.first %}eager{% else %}lazy{% endif %}">
          {% endif %}
          <div class="post-card-content">
            <div class="post-meta">
              <span>Niños</span>
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

  <section class="home-route-grid kids-route-grid" aria-label="Atajos principales de niños">
    <a class="home-route home-route--large" href="/los-mejores-zapatos-barefoot-para-ninos-presupuesto-de-cada-temporada/">
      <span>Guía principal</span>
      <strong>Mejores zapatos barefoot para niños</strong>
      <small>El punto de partida para comparar marcas, usos y temporadas.</small>
    </a>
    <a class="home-route" href="/preguntas-frecuentes-barefoot/">
      <span>Dudas</span>
      <strong>Preguntas frecuentes sobre niños</strong>
      <small>Tallas, transición, colegios, lluvia y problemas comunes.</small>
    </a>
    <a class="home-route" href="/las-mejores-botas-de-invierno-barefoot-para-ninos-que-juegan/">
      <span>Invierno</span>
      <strong>Botas infantiles barefoot</strong>
      <small>Opciones para frío, barro y días largos fuera de casa.</small>
    </a>
    <a class="home-route" href="/las-mejores-sandalias-de-barefoot-para-ninos/">
      <span>Verano</span>
      <strong>Sandalias barefoot para niños</strong>
      <small>Modelos frescos con suela flexible y dedos libres.</small>
    </a>
  </section>

  {% for topic in kidsTopics %}
    {% set topicItems = kidsPosts | postsMatchingPatterns(topic.patterns) %}

    {% if topicItems.length %}
      <section class="topic-section" id="{{ topic.key }}">
        <div class="section-head topic-head">
          <div>
            <p class="eyebrow">{{ topic.eyebrow }}</p>
            <h2>{{ topic.label }}</h2>
          </div>
          <p>{{ topic.description }}</p>
        </div>

        <div class="archive-grid topic-grid">
          {% for post in topicItems %}
            {% if loop.index <= 6 %}
              <article class="post-card">
                <a href="{{ post.url }}">
                  {% if post.data.image %}
                    <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy">
                  {% endif %}
                  <div class="post-card-content">
                    <div class="post-meta">
                      <span>{{ topic.label }}</span>
                      <time datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate }}</time>
                    </div>
                    <h3>{{ post.data.title }}</h3>
                    {% if post.data.description %}
                      <p>{{ post.data.description | safe }}</p>
                    {% endif %}
                  </div>
                </a>
              </article>
            {% endif %}
          {% endfor %}
        </div>
      </section>
    {% endif %}
  {% endfor %}

  <section class="topic-section" id="todos-los-posts-ninos">
    <div class="section-head topic-head">
      <div>
        <p class="eyebrow">Inventario infantil</p>
        <h2>Todos los artículos de niños</h2>
      </div>
      <p>{{ kidsPosts.length }} artículos para navegar la sección infantil completa como un blog.</p>
    </div>
    <div class="archive-grid topic-grid">
      {% for post in kidsPosts %}
        <article class="post-card">
          <a href="{{ post.url }}">
            {% if post.data.image %}
              <img src="{{ post.data.image }}" alt="{{ post.data.imageAlt or post.data.title }}" loading="lazy">
            {% endif %}
            <div class="post-card-content">
              <div class="post-meta">
                <span>Niños</span>
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
