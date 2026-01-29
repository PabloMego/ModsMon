import React from 'react';

const allMods = [
  'AdvancementPlaques', 'BetterF1-Fabric', 'BetterF3', 'BetterThirdPerson-Fabric', 'Carved Wood-fabric', 'CobbleDollars-fabric', 'CobbleFurnies-fabric', 'Cobblemon-fabric', 'Cobbleverse-journey-mounts', 'CobbleverseBadges', 'Cobbreeding', 'Controlling-fabric', 'Debugify', 'Essential', 'EuphoriaPatcher', 'ForgeConfigAPIPort-v21.1.6', 'Iceberg', 'ImmediatelyFast-Fabric', 'Luckys-Cozyhome-Refurnished', 'LumyMon', 'LumyREI', 'MoreCobblemonTweaks-fabric', 'MouseTweaks-fabric-mc1.21', 'MusicNotification-fabric-mc1.21', 'Only Bottle Caps', 'Ping-Wheel', 'ResourcePackOverrides-v21.1.0', 'RoughlyEnoughItems', 'SafePastures', 'Searchables-fabric', 'StackDeobfuscatorFabric', 'Terralith', 'accessories-fabric', 'accessories_compat_layer-fabric', 'advancementdisable-fabric', 'architectury', 'athena-fabric', 'balm-fabric', 'beautify', 'betterbeds-fabric', 'biomereplacer', 'brb', 'capturexp-fabric', 'cloth-config', 'cobblecuisine', 'cobbledgacha-fabric', 'cobblemon-additions', 'cobblemon-battle-extras-fabric', 'cobblenav-fabric', 'comforts-fabric', 'continuity', 'customsplashscreen', 'defaultoptions-fabric', 'entity_model_features', 'entity_texture_features', 'entityculling-fabric', 'fabric-api', 'fabric-language-kotlin', 'fancymenu_fabric', 'ferritecore', 'fightorflight-fabric', 'forgivingvoid-fabric', 'geckolib-fabric', 'globalpacks-fabric', 'handcrafted-fabric', 'highlight-fabric', 'huge-structure-blocks-fabric', 'infinite-music', 'interactic', 'iris-fabric', 'journey-mount', 'konkrete_fabric', 'krypton', 'lenientdeath', 'libjf', 'lithium-fabric', 'mega_showdown-fabric', 'melody_fabric', 'midnightlib', 'moar-concrete', 'modernfix-fabric', 'modmenu', 'moreculling-fabric', 'nethermap', 'netherportalfix-fabric', 'notenoughanimations-fabric', 'notenoughcrashes-fabric', 'owo-lib', 'packetfixer', 'paginatedadvancements', 'particlerain', 'particular', 'pastureLoot', 'playerxp-fabric', 'pokeblocks', 'rctapi-fabric', 'rctmod-fabric', 'reeses-sodium-options-fabric', 'repurposed_structures', 'resourcefullib-fabric', 'respackopts', 'smart_particles+mc1.21.1', 'sodium-extra-fabric', 'sodium-fabric', 'sodiumoptionsapi-fabric', 'sophisticatedbackpacks', 'sophisticatedcore', 'sophisticatedstorage', 'sound-physics-remastered-fabric', 'timcore-fabric', 'tmcraft', 'tooltipfix', 'trinkets', 'villagerconfig-fabric', 'waystones-fabric', 'xaerominimap-fabric', 'xaeroworldmap-fabric', 'yet_another_config_lib_v3', 'zamega-fabric', 'zoomify'
];

const AllMods: React.FC = () => {
  return (
    <section className="min-h-screen py-20 px-6 md:px-16 bg-bg-light dark:bg-bg-dark text-black dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black">Lista completa de mods</h1>
          <a href="/" className="px-4 py-2 bg-white/10 rounded-md hover:bg-white/20">Volver</a>
        </div>

        <p className="mb-6 text-lg text-black/60 dark:text-white/60">Total de mods: {allMods.length}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allMods.map((m, i) => (
            <div key={i} className="p-4 bg-white dark:bg-stone-gray/10 rounded-xl border border-black/5 dark:border-white/5">
              <div className="font-bold">{m}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllMods;
