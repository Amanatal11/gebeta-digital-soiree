import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Crown } from "lucide-react";

export type GameVariant = '12-hole' | '18-hole';

interface GameSetupProps {
    onStartGame: (variant: GameVariant) => void;
}

export const GameSetup = ({ onStartGame }: GameSetupProps) => {
    return (
        <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-primary mb-4">
                        ገበጣ Gebeta
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Traditional Ethiopian Mancala Strategy Game
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Choose your preferred board variant to begin
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* 12-Hole Variant */}
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-accent">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-6 h-6" />
                                    Classic Gebeta
                                </CardTitle>
                                <Badge variant="secondary">12 Holes</Badge>
                            </div>
                            <CardDescription>
                                Traditional 2×6 board layout with 4 seeds per hole
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <strong>Board:</strong> 2 rows × 6 holes each
                                </div>
                                <div className="text-sm">
                                    <strong>Seeds:</strong> 48 total (4 per hole)
                                </div>
                                <div className="text-sm">
                                    <strong>Style:</strong> Rectangular layout
                                </div>
                                <Button
                                    onClick={() => onStartGame('12-hole')}
                                    className="w-full mt-4"
                                    size="lg"
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Play Classic Gebeta
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 18-Hole Variant */}
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-accent">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="w-6 h-6" />
                                    Gabata (3-Row)
                                </CardTitle>
                                <Badge variant="default">18 Holes</Badge>
                            </div>
                            <CardDescription>
                                Advanced 3×6 board with race phase and relay sowing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <strong>Board:</strong> 3 rows × 6 holes each
                                </div>
                                <div className="text-sm">
                                    <strong>Seeds:</strong> 54 total (3 per hole)
                                </div>
                                <div className="text-sm">
                                    <strong>Special:</strong> Race phase + relay mechanics
                                </div>
                                <Button
                                    onClick={() => onStartGame('18-hole')}
                                    className="w-full mt-4"
                                    size="lg"
                                    variant="default"
                                >
                                    <Crown className="w-4 h-4 mr-2" />
                                    Play Gabata
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cultural Information */}
                <Card className="bg-card/50 border-dashed">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            🇪🇹 About Gebeta (ገበጣ)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>
                            <strong>Gebeta (ገበጣ)</strong> is a traditional Ethiopian strategy game belonging to the
                            mancala family, with roots dating back to the 6th-7th century AD. Archaeological
                            artifacts found in ancient Axum and Yeha showcase its deep historical significance
                            in Ethiopian culture.
                        </p>
                        <p>
                            Also known as <strong>Gabata</strong>, this game represents the strategic distribution
                            of seeds (typically coffee beans or pebbles) across pits carved into the earth,
                            wood, or stone. Players compete to capture the most counters through tactical
                            sowing and capturing maneuvers.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            <div>
                                <strong>🎯 Objective:</strong> Capture more seeds than your opponent
                            </div>
                            <div>
                                <strong>🌍 Origin:</strong> Northern Ethiopia (Tigrai region)
                            </div>
                            <div>
                                <strong>🏺 History:</strong> 6th-7th century AD archaeological evidence
                            </div>
                            <div>
                                <strong>👥 Cultural:</strong> Played during coffee ceremonies and social gatherings
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                            <p className="text-xs italic">
                                "Gebeta teaches patience, strategy, and the value of each move - much like life itself."
                                <br />— Traditional Ethiopian wisdom
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
