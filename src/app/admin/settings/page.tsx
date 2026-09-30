'use client';

import { useState } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'DubaiNegoce',
    email: 'contact@dubainegoce.fr',
    supportEmail: 'support@dubainegoce.fr',
    notificationEmail: 'admin@dubainegoce.fr',
    shippingCost: '4.10',
    inernationalShippingEnabled: true,
    maintenanceMode: false,
    analyticsEnabled: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configuration du site et des services</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-3 items-center">
          <span className="text-green-500">✅</span>
          <p className="text-sm text-green-700">Paramètres enregistrés avec succès!</p>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres Généraux
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom du site
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Principal
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Support
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Notification (Admin)
            </label>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) =>
                handleChange('notificationEmail', e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">📦 Paramètres d'Expédition</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Frais de Port par Défaut (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.shippingCost}
              onChange={(e) => handleChange('shippingCost', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Utilisé pour les commandes sans tarification spécifique
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inernationalShippingEnabled}
                onChange={(e) =>
                  handleChange('inernationalShippingEnabled', e.target.checked)
                }
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">
                Activer la livraison internationale
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Site Status */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">🔧 Statut du Site</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Mode Maintenance</p>
              <p className="text-sm text-muted-foreground">
                Le site sera indisponible pour les clients
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  handleChange('maintenanceMode', e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">Analytique Activée</p>
              <p className="text-sm text-muted-foreground">
                Suivi des métriques et comportement utilisateur
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.analyticsEnabled}
                onChange={(e) =>
                  handleChange('analyticsEnabled', e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Zone Dangereuse
        </h2>
        <p className="text-sm text-muted-foreground">
          Ces actions ne peuvent pas être annulées. Procédez avec prudence.
        </p>
        <button className="px-4 py-2 bg-red-500 text-red-50 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
          Supprimer toutes les données de test
        </button>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
        >
          <Save className="h-5 w-5" />
          Enregistrer les Paramètres
        </button>
        <button className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium">
          Annuler
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">💡 Note</h3>
        <p className="text-sm text-muted-foreground">
          Les paramètres sont enregistrés localement. Pour une synchronisation
          avec Firebase, une configuration supplémentaire est nécessaire.
        </p>
      </div>
    </div>
  );
}
