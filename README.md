#include <iostream>
using namespace std;

int main()
{
    int numeroInicial=0, numeroFinal=0;
    cout<<"Insira numero inicial: ";
    cin>>numeroInicial;
    cout<<"Insira numero Final: ";
    cin>>numeroFinal;
    while(numeroInicial<=numeroFinal){
        if(numeroInicial%2==0){
            cout<<numeroInicial<<endl;
        }
    numeroInicial++;
    }
    return 0;
}
