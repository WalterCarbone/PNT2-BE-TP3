new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
        evento:{
            tipo:'',
            impacto:0,
       },
       
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.saludJugador=100;
            this.saludMonstruo=100;
            this.hayUnaPartidaEnJuego=true;
            },

        atacar: function () {
            this.esJugador=true;          
            
            var danio=this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo-=danio;
            this.evento.tipo='atacar',
            this.evento.impacto=danio,
            this.registrarEvento(this.evento);
                            
            if (this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            this.esJugador=true;
            var danioEspecial=this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo-=danioEspecial;
            this.evento.tipo='especial',
            this.evento.impacto=danioEspecial,
            this.registrarEvento(this.evento);
           
            if (this.verificarGanador()){
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            this.esJugador=true;
            if(this.saludJugador<=90){
                this.saludJugador+=10;
                this.evento.impacto=10;
            }else{
                this.evento.impacto=100-this.saludJugador;
                this.saludJugador=100;
            }
            this.evento.tipo='curar',
            
            this.registrarEvento(this.evento);

            this.ataqueDelMonstruo();
        },

        registrarEvento(event) {
               
                switch(event.tipo) {
                    case 'atacar':
                        this.turnos.unshift({
                            esJugador:this.esJugador,
                            text:'El jugador ataca por ' + event.impacto,
                        })
                      break;
                    case 'especial':
                        this.turnos.unshift({
                            esJugador:this.esJugador,
                            text:'El jugador ataca especial por ' + event.impacto,
                        })
                      break;

                    case 'curar':
                        this.turnos.unshift({
                            esJugador:this.esJugador,
                            text:'El jugador recupera salud por ' + event.impacto,
                        })
                    break; 
                    case 'mostruo':
                        this.turnos.unshift({
                            esJugador:this.esJugador,
                            text:'El monstruo lastima al jugador en ' + event.impacto,
                        })
                      break;
                  }
            
            
            

           
           
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego=false;
        },

        ataqueDelMonstruo: function () {
            this.esJugador=false;
            var danioMostruo=this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador-=danioMostruo;
            this.evento.tipo='mostruo',
            this.evento.impacto=danioMostruo,
            this.registrarEvento(this.evento);
            this.verificarGanador();
           
        },

        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random()*rango[1])+1,rango[0]);   

        },
        verificarGanador: function () {
            if(this.saludMonstruo<=0) {
                    if(confirm('Ganaste! Jugar nuevamente?')){
                        this.empezarPartida();
                    } else{
                        this.hayUnaPartidaEnJuego=false;
                    }
                    return true;
            }else if (this.saludJugador <=0){
                if (confirm('Perdiste! Jugar nuevamente?')){
                    this.empezarPartida();
                }else {
                    this.hayUnaPartidaEnJuego=false;
                }
                return true;
            }

            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});