'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Send, Mail } from 'lucide-react';
import { useAuth } from '@/firebase';
import { adminFetch } from '@/lib/admin-fetch';

interface CampaignResult {
  success: boolean;
  sent?: number;
  failed?: number;
  message: string;
  totalUsers?: number;
  promoCode?: string;
  errors?: Array<{ email: string; error: string }>;
}

export default function CampaignsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [promoCode, setPromoCode] = useState('PNEUF5');
  const [testEmail, setTestEmail] = useState('');
  const [showTestForm, setShowTestForm] = useState(false);
  const auth = useAuth();

  // Envoyer la campagne à tous les utilisateurs
  const handleSendCampaign = async () => {
    if (!confirm('⚠️ Êtes-vous sûr ? Cette campagne sera envoyée à TOUS les utilisateurs inscrits !')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await adminFetch(auth, '/api/admin/send-makeover-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promoCode,
          dryRun: false
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Erreur lors de l\'envoi : ' + String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Prévisualiser la campagne
  const handlePreview = async () => {
    setLoading(true);
    try {
      const response = await adminFetch(auth, '/api/admin/send-makeover-campaign?preview=true');
      const data = await response.json();
      setResult({
        success: true,
        message: 'Aperçu de la campagne',
        ...data
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Erreur : ' + String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un test
  const handleSendTest = async () => {
    if (!testEmail) {
      alert('Veuillez entrer une adresse email');
      return;
    }

    setLoading(true);
    try {
      const response = await adminFetch(
        auth,
        `/api/admin/send-makeover-campaign?preview=true&testEmail=${encodeURIComponent(testEmail)}`
      );
      const data = await response.json();
      setResult({
        success: true,
        message: `Email de test envoyé à ${testEmail}`,
        ...data
      });
      setTestEmail('');
      setShowTestForm(false);
    } catch (error) {
      setResult({
        success: false,
        message: 'Erreur : ' + String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campagnes Email</h1>
        <p className="text-muted-foreground mt-2">
          Gérez et envoyez des campagnes marketing à vos clients
        </p>
      </div>

      {/* Campagne "Peau neuf" */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-pink-600" />
            🌹 Dubai Négoce fait peau neuf
          </CardTitle>
          <CardDescription>
            Présenter le nouveau design et offrir -5% de réduction aux clients existants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="promo-code">Code promo</Label>
              <Input
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Ex: PNEUF5"
                className="mt-1"
              />
            </div>

            <div className="pt-2">
              <h4 className="font-semibold mb-3 text-sm">Contenu de la campagne:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✅ Annonce du nouveau design</li>
                <li>✅ 3 parfums tendance sélectionnés</li>
                <li>✅ Code promo -5%: <Badge variant="secondary">{promoCode}</Badge></li>
                <li>✅ CTA vers la boutique</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handlePreview}
              disabled={loading}
              variant="outline"
            >
              👁️ Prévisualiser
            </Button>

            <Button
              onClick={() => setShowTestForm(!showTestForm)}
              disabled={loading}
              variant="outline"
            >
              📧 Envoyer un test
            </Button>

            <Button
              onClick={handleSendCampaign}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {loading ? '⏳ Envoi en cours...' : '🚀 Envoyer à tous'}
            </Button>
          </div>

          {/* Formulaire test */}
          {showTestForm && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <Label htmlFor="test-email">Adresse email de test</Label>
              <div className="flex gap-2">
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
                <Button
                  onClick={handleSendTest}
                  disabled={loading || !testEmail}
                  variant="secondary"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          )}

          {/* Résultats */}
          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                    {result.message}
                  </p>

                  {result.sent !== undefined && (
                    <div className="mt-3 space-y-1 text-sm">
                      <p>
                        ✅ Envoyés: <span className="font-semibold">{result.sent}</span>
                      </p>
                      {result.failed !== undefined && result.failed > 0 && (
                        <p className="text-red-600">
                          ❌ Erreurs: <span className="font-semibold">{result.failed}</span>
                        </p>
                      )}
                      {result.totalUsers && (
                        <p>
                          👥 Total utilisateurs: <span className="font-semibold">{result.totalUsers}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-3 text-sm">
                      <p className="font-semibold mb-2">Emails échoués:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        {result.errors.slice(0, 5).map((err, i) => (
                          <li key={i} className="text-xs">
                            {err.email}: {err.error}
                          </li>
                        ))}
                        {result.errors.length > 5 && (
                          <li className="text-xs">... et {result.errors.length - 5} autres</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info de sécurité */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">ℹ️ Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-2">
          <p>
            • Cette campagne sera envoyée à <strong>tous les utilisateurs inscrits</strong> dans la base de données
          </p>
          <p>
            • Code promo applicable automatiquement lors du checkout
          </p>
          <p>
            • Les emails sont loggés dans Firestore pour suivi (ouvertures, clics)
          </p>
          <p>
            • Vous pouvez envoyer un test avant de lancer la campagne complète
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
