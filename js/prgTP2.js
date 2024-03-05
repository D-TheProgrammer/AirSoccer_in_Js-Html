//On crée l'image de début du jeu 
let cnv_fondDemarrer = document.getElementById('fondDemarrer');
let ctx_fondDemarrer = cnv_fondDemarrer.getContext('2d');
ctx_fondDemarrer.imageSmoothingEnabled = false;

let img_fondDemarrer = new Image();
img_fondDemarrer.src = "./assets/AirSoccer_fondMenu.png";

img_fondDemarrer.onload = function () { 
    ctx_fondDemarrer.drawImage(img_fondDemarrer, 0, 0, cnv_fondDemarrer.width, cnv_fondDemarrer.height);
};

//Bouton demarrer qui au clic va demarrer le jeu , il contient toutes les fonctions
var bouton_demarrer = document.getElementById("BoutonDemarrer");
bouton_demarrer.addEventListener("click", function() {
    jeu();
});



function jeu(){
    //on fait disparaitre le bouton demarrer
    bouton_demarrer.style.display = "none";


    // Utilisation du canvas HTML pour le fond terrain de jeu en couleur presque blanche
    let cnv = document.getElementById('monFond');
    let larg_cnv_fond= cnv.width;  //la plupart des canvas on les utilisera pour certain calcul avec dautre canvas
    let haut_cnv_fond= cnv.height;

    let ctx_fond = cnv.getContext('2d');
    ctx_fond.imageSmoothingEnabled = false;

    let img_fond = new Image();
    img_fond.src = "./assets/terrain_foot.png";

    img_fond.onload = function () { 
        ctx_fond.drawImage(img_fond, 0, 0, cnv.width, cnv.height);
    };

    //Reccuperation du canvas pour le tutoriel 
    let cnv_tutoriel = document.getElementById('tutoriel');
    let ctx_tutoriel = cnv_tutoriel.getContext('2d');
    //Creation du texte avec la polite et la couleur
    ctx_tutoriel.font = '20px Arial';
    ctx_tutoriel.fillStyle = 'red';
    ctx_tutoriel.fillText('Tutoriel : (/!| SI LE PROGRAMME BUG au demarrage REDEMARREZ LE /!|) ', 10, 30);

    //Ce texte est trop grand va falloir le decouper pour afficher 
    ctx_tutoriel.fillStyle = 'green';
    let texte = "Ce projet est un jeu de football (une sorte de air hockey). Vous contrôlez le joueur rouge\navec votre souris, et en déplaçant le curseur, vous pourrez tirer la balle plus ou moins\nfortement. Le but est bien évidemment d'avoir le meilleur score contre l'ordinateur.";
    var x_ligne = 30; // position x des lignes de tutoriel
    var y_ligne = 50; // position y des lignes de tutoriel
    var hauteur_ligne = 20; //Separation des ligne 
    var ligne_texte = texte.split('\n'); // Separation en liste du texte a chaque retour a la ligne

    //Affiche le texte avec des retours à la ligne
    for (var i = 0; i<ligne_texte.length; i++){
        ctx_tutoriel.fillText(ligne_texte[i], x_ligne, y_ligne + (i*hauteur_ligne)); 
    }


    //oN Reccupere le canvas Poignee joueur pour charger l'image
    let cnv_poigneeJoueur = document.getElementById('poigneeJoueur');
    let ctx_poigneeJoueur = cnv_poigneeJoueur.getContext('2d');

    let img_poigneeJoueur = new Image();
    img_poigneeJoueur.src = "./assets/poignee_rouge.png";

    img_poigneeJoueur.onload = function () { 
        ctx_poigneeJoueur.drawImage(img_poigneeJoueur, 0, 0, cnv.width, cnv.height/2);
    };

    // On utilise le canvas pour la poignée de l'adversaire
    let cnv_poigneeAdversaire = document.getElementById('poigneeAdversaire');
    let ctx_poigneeAdversaire = cnv_poigneeAdversaire.getContext('2d');

    let img_poigneeAdversaire = new Image();
    img_poigneeAdversaire.src = "./assets/poignee_bleu.png";

    img_poigneeAdversaire.onload = function () { 
        ctx_poigneeAdversaire.drawImage(img_poigneeAdversaire, 0, 0, cnv.width, cnv.height/2);
    };

    let posXPoigneeAdversaire = 3* (larg_cnv_fond /4); //XY de ladversaire
    let posYPoigneeAdversaire = haut_cnv_fond /2 ; 


    //Pour la poignée cest a dire le joueur 
    let rayonPoignee = 40; //rayon cercle representant le joueur
    let rayonPoigneeAdversaire = 40;  //rayon cercle representant le adversaire


    //On utilise le canvas du ballon pour charger l'image
    let cnv_ballon = document.getElementById('ballon');
    let ctx_ballon = cnv_ballon.getContext('2d');

    let img_ballon = new Image();
    img_ballon.src = "./assets/ball.png";

    img_ballon.onload = function () { 
        ctx_ballon.drawImage(img_ballon, 0, 0, cnv.width, cnv.height/2);
    };


    //On  utilise le canvas du But 
    let cnv_but = document.getElementById('but');
    let ctx_but = cnv_but.getContext('2d');

    //Initialisation des caracteristiques du ballon
    let rayon_balle = 30;
    let posX_Balle = cnv.width / 2;
    let posY_Balle = cnv.height / 2;

    let vitesseBalleX = 0;
    let vitesseBalleY = 0;

    let nouvelle_vitesse = 0;

    //Pour le deplacement de la souris du joueur
    let souris_x_joueur;
    let souris_y_joueur;

    //Variable permettant de gerer le temps pour diminuer la vitesse de la balle au fil du temps
    let temps_Precedent = 0;
    let temps_Actuel = 0;
    let nouveau_temps = 0;

    //Score de la partie, on initialise et affiche
    let cnv_score = document.getElementById('score');
    let ctx_score = cnv_score.getContext('2d');
    ctx_score.font = '34px Arial';
    ctx_score.fillStyle = 'black';

    let taille_ligne= 34 ; //autrement dit taille police + 5
    let scoreJoueur = 0;
    let scoreAdversaire = 0;

    //afficge le score au depart
    
    ctx_score.clearRect(0, 0, cnv_score.width, cnv_score.height);
    ctx_score.fillText(`Score`, (larg_cnv_fond / 2)-taille_ligne-10 , taille_ligne);
    ctx_score.fillText(`${scoreJoueur} : ${scoreAdversaire}`, (larg_cnv_fond / 2)- taille_ligne , taille_ligne *2);

    //Fonction qui met a jour le score lors dun but 
    function augmenter_score() {
        //On efface l'ancien score 
        ctx_score.clearRect(0, 0, cnv_score.width, cnv_score.height);
        //Affiche le nouveau
        ctx_score.fillText(`Score`, (larg_cnv_fond / 2)-taille_ligne-10, taille_ligne);
        ctx_score.fillText(`${scoreJoueur} : ${scoreAdversaire}`, (larg_cnv_fond / 2)- taille_ligne , taille_ligne *2);
    }

    //Pour reccuperer les position de la souris sur laxe X ou Y 
    addEventListener("mousemove", (e) => {
        //On a decallé le coin haut gauche des canvas pour centré la page on va reccuperer ses coordonnées
        let coin_canvas = cnv.getBoundingClientRect();
        //Maintenant en plus de reccuper XY de la souris il faudra décaler en fonction du coin superieur des canvas 
        souris_x_joueur = e.clientX - coin_canvas.left;
        souris_y_joueur = e.clientY - coin_canvas.top;

        //afin que le joueur ne puisse pas dépasser sa moitié du terrain
        if (souris_x_joueur > larg_cnv_fond / 2){
            souris_x_joueur=larg_cnv_fond /2;
        }

        //Utile trouver la vitesse de deplacement de la souris et faire se deplacer plus ou moin vite la balle
        temps_Actuel = Date.now();
        nouveau_temps = temps_Actuel - temps_Precedent;
        temps_Precedent = temps_Actuel;
    });


    //Ici on va travailler sur une fonction qui sera utile pour ralentir la balle au fil du temps 
    let compteARebours_max = 100; // Le compte à rebours démarre à 100
    let indice_de_reduc=1; 

    function compteARebours_ralentiBalle() {
        // console.log(compteARebours_max); //pour debugger
    
        //Quand 4 secondes sont ecoulé ont commence a décrémmenter la vitesse
        if (compteARebours_max > 0 &&compteARebours_max < 60) {
        
            //ce if permet de debuger et eviter que sa decremente quand on retouche la balle
            //tant que la vitesse est au dessus de 1 on la fait diminuer 
            if ((Math.abs(vitesseBalleX) >  1)  || (Math.abs(vitesseBalleY) > 1)){
                vitesseBalleX = vitesseBalleX / indice_de_reduc;
                vitesseBalleY = vitesseBalleY / indice_de_reduc;
                indice_de_reduc += 0.001;
            }   
            else{
                clearInterval(compteur); // Arrête le compte à rebours une fois arrivé à 0 et on reinitiale 
                compteARebours_max = 100;
                balle_touche = false;
                compteur=0;
                return ;
            }
            // console.log(vitesseBalleX); //pour debugger
            // console.log(vitesseBalleY);
        }

        //dans le cas ou la balle est si rapide quau bout de 10 seconde la balle nest pas ralenti
        else if (  compteARebours_max <=  0){
            clearInterval(compteur); // Arrête le compte à rebours une fois arrivé à 0
            compteARebours_max = 100;
            balle_touche = false;
            compteur=0;
            return ; //reinitialisation du compteur a rebours
        }
        
        
        compteARebours_max--; // Décrémente le compte à rebours d'une seconde
    }

    //initialisation de varaible qui recevra le compteur 
    let compteur =0;// Met à jour le compte à rebours chaque seconde (1000 millisecondes)

    //Ajout d'une variable pour indiquer si la balle a eté touché , servira a recalibrer la fonction de compte a rebours vitesse 
    //si on touche la balle plusieurs fois
    let balle_touche = false;


    function deplace_colisionBalle() {
        requestAnimationFrame(deplace_colisionBalle);

        // Mise à jour de la position de la balle
        posX_Balle += vitesseBalleX;
        posY_Balle += vitesseBalleY;
        nouvelle_vitesse = (souris_x_joueur / nouveau_temps) / 4;

        //Création d"un cap de vitesse pour ne pas que le ballon puisse attendre une vitesse démentielle 
        //en focntion de la puissance du tir (c'est a dire la vitesse du curseur)
        if (nouvelle_vitesse > 20) {
            nouvelle_vitesse = 20;
        }

        //Gestion des collision avec le contour de la page
        if (posX_Balle - rayon_balle < 0 || posX_Balle + rayon_balle > cnv.width) {
            vitesseBalleX = -vitesseBalleX;
        }
        if (posY_Balle - rayon_balle < 0 || posY_Balle + rayon_balle > cnv.height) {
            vitesseBalleY = -vitesseBalleY;
        }

        //(si cas exeptionnel ou la balle arriver a traverser la barriere) 
        if (posX_Balle - rayon_balle < -50 || posX_Balle + rayon_balle > cnv.width +50) {
            vitesseBalleX = -vitesseBalleX;
            posX_Balle = cnv.width / 2;
            posY_Balle = cnv.height / 2;
        }
        
        if (posY_Balle - rayon_balle < -50 || posY_Balle + rayon_balle > cnv.height +50) {
            vitesseBalleY = -vitesseBalleY;
            posX_Balle = cnv.width / 2;
            posY_Balle = cnv.height / 2;
        }
        

        //Pour la distance entre la balle et la poignée
        let distancePoignee = Math.sqrt(Math.pow(posX_Balle - souris_x_joueur, 2) + Math.pow(posY_Balle - souris_y_joueur, 2));

        // Gestion de la collision avec la souris
        if (distancePoignee < rayon_balle + rayonPoignee) {
            vitesseBalleX = (posX_Balle - souris_x_joueur) * nouvelle_vitesse / distancePoignee;
            vitesseBalleY = (posY_Balle - souris_y_joueur) * nouvelle_vitesse / distancePoignee;
        
            // Calcul de la direction en fonction des plages d'angles
            //pour cela nous avons bseoiin de 8 part
            let angleDeg = ((Math.atan2(souris_y_joueur - posY_Balle, souris_x_joueur - posX_Balle) * 180) / Math.PI);
            angleDeg = (angleDeg + 360) % 360;
        

            compteARebours_max = 100;  // on se prepare a reinitialiser la fonciton qui ralenti la balle
            
            
            // Gestion de la direction avec des intervalles de 45 degrés
            if ((angleDeg >= 337.5 || angleDeg < 22.5)) {
                // Aller à gauche
                vitesseBalleX = -nouvelle_vitesse;
                vitesseBalleY = 0;
                
            } else if (angleDeg >= 22.5 && angleDeg < 67.5) {
                // Aller à haut-gauche
                vitesseBalleX = -nouvelle_vitesse;
                vitesseBalleY = -nouvelle_vitesse;
                
            } else if (angleDeg >= 67.5 && angleDeg < 112.5) {
                // Aller en haut
                vitesseBalleX = 0;
                vitesseBalleY = -nouvelle_vitesse;
                
            } else if (angleDeg >= 112.5 && angleDeg < 157.5) {
                // Aller à haut-droite
                vitesseBalleX = nouvelle_vitesse;
                vitesseBalleY = -nouvelle_vitesse;
                
            } else if (angleDeg >= 157.5 && angleDeg < 202.5) {
                // Aller à droite
                vitesseBalleX = nouvelle_vitesse;
                vitesseBalleY = 0;
                
            } else if (angleDeg >= 202.5 && angleDeg < 247.5) {
                // Aller à bas-droite
                vitesseBalleX = nouvelle_vitesse;
                vitesseBalleY = nouvelle_vitesse;
                
            } else if (angleDeg >= 247.5 && angleDeg < 292.5) {
                // Aller en bas
                vitesseBalleX = 0;
                vitesseBalleY = nouvelle_vitesse;
                
            } else if (angleDeg >= 292.5 && angleDeg < 337.5) {
                // Aller à bas-gauche
                vitesseBalleX = -nouvelle_vitesse;
                vitesseBalleY = nouvelle_vitesse;
                
            }

            if (!balle_touche) {
                balle_touche = true; // Marquez la balle comme touchée
                clearInterval(compteur);
                compteur = setInterval(compteARebours_ralentiBalle, 100);
            }
        }

        else{
            // Réinitialisez si la balle n'est pas touchée
            balle_touche = false;
        }


        //Si on marque un but contre le camp du joueur on replace la balle
        //les cages etant placer a 1 quart du bord jusquau 3eme quart suffi de mettre cela dans les condition 
        if (posX_Balle - rayon_balle < 0 && ( ( posY_Balle > (haut_cnv_fond /4) ) && (posY_Balle < 3 * (haut_cnv_fond /4)) )  ) {
            vitesseBalleX = 0;
            vitesseBalleY = 0;
            posX_Balle = larg_cnv_fond / 4;

            //On augmente le score de ladversaire
            scoreAdversaire++;
            augmenter_score();
        }

        //si le joueur ariive a marqué chez l'adversaire
        else if (posX_Balle + rayon_balle >= larg_cnv_fond && ( ( posY_Balle > (haut_cnv_fond /4) ) && (posY_Balle < 3 * (haut_cnv_fond /4)) )  ) {
            vitesseBalleX = 0;
            vitesseBalleY = 0;
            posX_Balle = 3* (larg_cnv_fond / 4);

            //On augmente le score de du joeuur
            scoreJoueur++;
            augmenter_score();
        }
        
        
        //Creation du ballon (ici on crée un cercle bleu et on placera son image au meme endroit)
        // OnEfface le canvas
        ctx_ballon.clearRect(0, 0, cnv.width, cnv.height);
        // Ici on Dessine la balle
        ctx_ballon.fillStyle = 'blue';
        ctx_ballon.beginPath();
        ctx_ballon.arc(posX_Balle, posY_Balle, rayon_balle, 0, Math.PI * 2);
        ctx_ballon.fill();
        ctx_ballon.drawImage(img_ballon, posX_Balle - rayon_balle, posY_Balle - rayon_balle, rayon_balle * 2 , rayon_balle * 2);
        
        //on dessine la poignée du joueur (ici par sécurité on dessine le cercle rouge puis on y appose l'image)
        ctx_poigneeJoueur.clearRect(0, 0, cnv_poigneeJoueur.width, cnv_poigneeJoueur.height);
        ctx_poigneeJoueur.fillStyle = 'red';
        ctx_poigneeJoueur.beginPath();
        ctx_poigneeJoueur.arc(souris_x_joueur, souris_y_joueur, rayonPoignee, 0, Math.PI * 2);
        ctx_poigneeJoueur.fill();
        ctx_poigneeJoueur.drawImage(img_poigneeJoueur, souris_x_joueur - rayonPoignee, souris_y_joueur - rayonPoignee, rayonPoignee * 2, rayonPoignee * 2);

        // Dessin But Joueur
        ctx_but.fillStyle = 'red';
        ctx_but.fillRect(0, (haut_cnv_fond /4), 10 , (haut_cnv_fond / 2)  );

        // Dessin But adversaire  
        ctx_but.fillStyle = 'blue';
        ctx_but.fillRect(larg_cnv_fond-10, (haut_cnv_fond /4), 10 , (haut_cnv_fond / 2)  );

    }

    deplace_colisionBalle();



    function mouvement_auto_poigneeAdv() {
        requestAnimationFrame(mouvement_auto_poigneeAdv);

        // Calcul de la direction de l'adversaire pour suivre la balle
        let directionX = posX_Balle - posXPoigneeAdversaire;
        let directionY = posY_Balle - posYPoigneeAdversaire;
        let dist_poig_adv = Math.sqrt(directionX * directionX + directionY * directionY);

        //Vitesse de déplacement de l'adversaire
        let vitessePoigneeAdversaire = 4;

        if (dist_poig_adv > 0) {
            directionX /= dist_poig_adv;
            directionY /= dist_poig_adv;
        }

        // Vérifiez si la balle est superposée à l'ordinateur
        let distanceBalleOrdinateur = Math.sqrt(Math.pow(posX_Balle - posXPoigneeAdversaire, 2) + Math.pow(posY_Balle - posYPoigneeAdversaire, 2));
        let distanceMinimale = rayon_balle + rayonPoigneeAdversaire;

        if (distanceBalleOrdinateur > distanceMinimale) {
            // Mise à jour de la position de la poignée de l'ordinateur
            posXPoigneeAdversaire += directionX * vitessePoigneeAdversaire;
            posYPoigneeAdversaire += directionY * vitessePoigneeAdversaire;

            // Limitation sur al partie droite du terrain de  la position de la poignée
            posXPoigneeAdversaire = Math.max(larg_cnv_fond / 2, posXPoigneeAdversaire);
            posXPoigneeAdversaire = Math.min(larg_cnv_fond, posXPoigneeAdversaire);
            posYPoigneeAdversaire = Math.max(0, posYPoigneeAdversaire); 
            posYPoigneeAdversaire = Math.min(haut_cnv_fond, posYPoigneeAdversaire); 
        }

    
        // Gestion de la collision 
        if (dist_poig_adv < rayon_balle + rayonPoigneeAdversaire) {
            vitesseBalleX = (posX_Balle - posXPoigneeAdversaire) * nouvelle_vitesse / dist_poig_adv;
            vitesseBalleY = (posY_Balle - posYPoigneeAdversaire) * nouvelle_vitesse / dist_poig_adv;
        
            // Calcul de la direction en fonction  d'angles
            //pour cela nous avons bseoiin de 8 angles
            let angleDeg_ball_adv = ((Math.atan2(posXPoigneeAdversaire - posX_Balle, posYPoigneeAdversaire - posY_Balle) * 180) / Math.PI);
            angleDeg_ball_adv = (angleDeg_ball_adv + 360) % 360;
        

            compteARebours_max = 100;  
            
            
            // Gestion de la direction avec des intervalles de 45 degrés
            if ((angleDeg_ball_adv >= 337.5 || angleDeg_ball_adv < 22.5)) {
                // Aller à gauche
                vitesseBalleX = -nouvelle_vitesse;
                vitesseBalleY = 0;
                
            } else if (angleDeg_ball_adv >= 22.5 && angleDeg_ball_adv < 67.5) {
                // Aller à haut-gauche
                vitesseBalleX = -nouvelle_vitesse;
                vitesseBalleY = -nouvelle_vitesse;
                
            } else if (angleDeg_ball_adv >= 67.5 && angleDeg_ball_adv < 112.5) {
                // Aller en haut
                vitesseBalleX = 0;
                vitesseBalleY = -nouvelle_vitesse;
                
            } else if (angleDeg_ball_adv >= 112.5 && angleDeg_ball_adv < 157.5) {
                // Aller à haut-droite
                vitesseBalleX = nouvelle_vitesse;
                vitesseBalleY = -nouvelle_vitesse;
                
            } else if (angleDeg_ball_adv >= 157.5 && angleDeg_ball_adv < 202.5) {
                // Aller à droite
                vitesseBalleX = nouvelle_vitesse;
                vitesseBalleY = 0;
                
            } else if (angleDeg_ball_adv >= 202.5 && angleDeg_ball_adv < 247.5) {
                // Aller à bas-droite
                vitesseBalleX = nouvelle_vitesse;
                vitesseBalleY = nouvelle_vitesse;
                
            } else if (angleDeg_ball_adv >= 247.5 && angleDeg_ball_adv < 292.5) {
                // Aller en bas
                vitesseBalleX = 0;
                vitesseBalleY = nouvelle_vitesse;
                
            } else if (angleDeg_ball_adv >= 292.5 && angleDeg_ball_adv < 337.5) {
                // Aller à bas-gauche
                vitesseBalleX = -nouvelle_vitesse;
                vitesseBalleY = nouvelle_vitesse;
            }

            if (!balle_touche) {
                balle_touche = true; 
                clearInterval(compteur);
                compteur = setInterval(compteARebours_ralentiBalle, 100);
            }
        }

        else{
            // Réinitialisez si la balle n'est pas touchée
            balle_touche = false;
        }

        // On affiche ladversaire
        ctx_poigneeAdversaire.clearRect(0, 0, cnv_poigneeAdversaire.width, cnv_poigneeAdversaire.height);
        ctx_poigneeAdversaire.fillStyle = 'yellow'; 
        ctx_poigneeAdversaire.beginPath();
        ctx_poigneeAdversaire.arc(posXPoigneeAdversaire, posYPoigneeAdversaire, rayonPoigneeAdversaire, 0, Math.PI * 2);
        ctx_poigneeAdversaire.fill();
        ctx_poigneeAdversaire.drawImage(img_poigneeAdversaire, posXPoigneeAdversaire - rayonPoigneeAdversaire, posYPoigneeAdversaire - rayonPoigneeAdversaire, rayonPoigneeAdversaire * 2, rayonPoigneeAdversaire * 2);

    }

    mouvement_auto_poigneeAdv();



}





//------------------------------